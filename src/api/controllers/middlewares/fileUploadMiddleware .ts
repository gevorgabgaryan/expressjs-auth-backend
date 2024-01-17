import { Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadFileRequest } from '../requests/auth/UploadFileRequest';
import config from '../../../config';

export const fileUploadMiddleware = (req: UploadFileRequest, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.headers['content-type']?.startsWith('multipart/form-data')) {
    const buffers: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      buffers.push(chunk);
    });

    req.on('end', () => {
      const rawData = Buffer.concat(buffers);
      const boundary = `--${req.headers['content-type']!.split('boundary=')[1]}`;
      const boundaryBuffer = Buffer.from(boundary, 'binary');

      // Split on the boundary buffer
      let lastIndex = 0;
      const parts: Buffer[] = [];
      while (lastIndex < rawData.length) {
        const index = rawData.indexOf(boundaryBuffer, lastIndex);
        if (index < 0) {
          break;
        }
        if (lastIndex != 0) {
          // Skip the preamble (CRLF before the boundary)
          const part = rawData.slice(lastIndex + 2, index - 2);
          parts.push(part);
        }
        lastIndex = index + boundaryBuffer.length;
      }

      req.body = {};
      req.files = [];

      parts.forEach((partBuffer) => {
        const headersEndIndex = partBuffer.indexOf('\r\n\r\n');
        if (headersEndIndex < 0) {
          return;
        }
        const headers = partBuffer.subarray(0, headersEndIndex).toString();
        const body = partBuffer.subarray(headersEndIndex + 4);
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
            path: `${uploadDir}/${filename}`,
            mimetype,
          });
        } else {
          const textValue = body.toString('utf8');
          req.body[fieldName] = textValue.replace(/[\r\n]+$/, '');
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
