import { Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadFileRequest } from '../requests/auth/UploadFileRequest';
import config from '../../../config';
import { AppError } from '../../../errors/AppError';
import { AppBadRequestError } from '../../../errors/AppBadRequestError';
import { ErrorField } from '../types/ErrorField';

export const fileUploadMiddleware = async (req: UploadFileRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.is('multipart/form-data')) {
      throw new AppBadRequestError('Invalid Content-Type.');
    }

    const buffers: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      buffers.push(chunk);
    });

    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });

    if (!req.headers['content-type']) {
      throw new AppError('Content-Type header is missing.');
    }
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
        next();
      }
      const headers = partBuffer.subarray(0, headersEndIndex).toString();
      const body = partBuffer.subarray(headersEndIndex + 4);
      if (!headers || !headers.split('\r\n')[0]) {
        next();
      }
      const contentDisposition = headers.split('\r\n')[0].split('; ');
      if (!contentDisposition[1]) {
        next();
      }
      const fieldName = contentDisposition[1].split('=')[1].replace(/"/g, '');

      if (contentDisposition.length === 3) {
        const details: ErrorField[] = [];
        const fileError: ErrorField = {
          field: 'file',
          constraints: [],
        };

        if (fieldName !== 'file') {
          fileError.constraints.push('Invalid file field name. Only "file" field allowed.');
          details.push(fileError);
          throw new AppBadRequestError('Invalid file field name', details);
        }

        const originalFileName = contentDisposition[2].split('=')[1].replace(/"/g, '');
        if (!headers.split('\r\n')[1]) {
          next();
        }
        const mimetype = headers.split('\r\n')[1].split(': ')[1];

        if (!['image/png', 'image/jpeg'].includes(mimetype)) {
          fileError.constraints.push('Invalid file type. Only PNG and JPEG are allowed.');
        }

        if (Buffer.byteLength(body, 'binary') > config.maxFileSize) {
          fileError.constraints.push('File size exceeds maximum limit of 3MB.');
        }

        if (fileError.constraints.length > 0) {
          details.push(fileError);
          throw new AppBadRequestError('File upload error', details);
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
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getFilePath = (originalname: string) => {
  const now = new Date();
  const dateFolder = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  const uploadDir = path.join(config.userAvatarDir, dateFolder);
  const filename = `${Date.now()}_${originalname}`;
  return { uploadDir, filename };
};
