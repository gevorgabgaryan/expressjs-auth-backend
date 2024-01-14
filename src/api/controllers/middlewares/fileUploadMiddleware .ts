import { Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadFileRequest } from '../requests/auth/UploadFileRequest';
import config from '../../../config';

export const fileUploadMiddleware = (req: UploadFileRequest, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.headers['content-type']?.startsWith('multipart/form-data')) {
    let rawData = '';

    req.on('data', (chunk: Buffer) => (rawData += chunk));
    req.on('end', () => {
      const boundary = `--${req.headers['content-type']!.split('boundary=')[1]}`;
      rawData = rawData.substring(0, rawData.lastIndexOf(boundary)); // Trim last boundary
      const parts = rawData
        .split(boundary)
        .slice(1)
        .map((part) => part.substring(4, part.lastIndexOf('\r\n')));

      req.body = {};
      req.files = [];

      parts.forEach((part) => {
        const [headers, body] = part.split('\r\n\r\n');
        const contentDisposition = headers.split('\r\n')[0].split('; ');
        const fieldName = contentDisposition[1].split('=')[1].replace(/"/g, '');

        if (contentDisposition.length === 3) {
          if (fieldName !== 'file') {
            return res.status(400).send('Invalid file field name. Only "file" field allowed.');
          }
          const originalFileName = contentDisposition[2].split('=')[1].replace(/"/g, '');
          const mimetype = headers.split('\r\n')[1].split(': ')[1];

          if (!['image/png', 'image/jpeg'].includes(mimetype)) {
            return res.status(400).send('Invalid file type. Only PNG and JPEG are allowed.');
          }

          if (Buffer.byteLength(body, 'binary') > config.maxFileSize) {
            return res.status(400).send('File size exceeds maximum limit of 3MB.');
          }

          const { uploadDir, filename } = getFilePath(originalFileName);
          const absolutePath = path.join(process.cwd(), uploadDir);

          if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
          }

          const fullFilePath = path.join(absolutePath, filename);
          fs.writeFileSync(fullFilePath, body, 'binary');

          req.files.push({
            filename: filename,
            path: uploadDir,
            mimetype,
          });
        } else {
          let value = body;
          if (body) {
            const endOfValueIndex = body.lastIndexOf('\r\n');
            if (endOfValueIndex !== -1) {
              value = body.slice(0, endOfValueIndex);
            }
          }

          req.body[fieldName] = value;
        }
      });

      next();
    });
  } else {
    next();
  }
};

const getFilePath = (originalname: string) => {
  const now = new Date();
  const dateFolder = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  const uploadDir = path.join(config.userAvatarDir, dateFolder);
  const filename = `${Date.now()}_${originalname}`;
  return { uploadDir, filename };
};
