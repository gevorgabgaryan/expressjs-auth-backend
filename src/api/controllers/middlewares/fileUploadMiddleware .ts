import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { AppError } from '../../../errors/AppError';
import { AppBadRequestError } from '../../../errors/AppBadRequestError';
import { FileBody } from '../requests/file/FileBody';

export const fileUploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

    parts.forEach((partBuffer) => {
      const headersEndIndex = partBuffer.indexOf('\r\n\r\n');
      if (headersEndIndex < 0) {
        next();
      }
      const headers = partBuffer.subarray(0, headersEndIndex).toString();
      const body = partBuffer.subarray(headersEndIndex + 4);
      const contentDisposition = headers.split('\r\n')[0].split('; ');

      const fieldNameKeyValue = contentDisposition[1].split('=');
      const fieldName = fieldNameKeyValue[1].replace(/"/g, '');

      if (contentDisposition.length === 3) {
        if (!req.body[fieldName]) {
          req.body[fieldName] = [];
        }

        const fileBody = new FileBody();
        const originalFileName = contentDisposition[2].split('=')[1].replace(/"/g, '');
        const mimeType = headers.split('\r\n')[1].split(': ')[1];

        fileBody.originalname = originalFileName;
        fileBody.filetype = mimeType.split('/')[1];
        fileBody.size = Buffer.byteLength(body, 'binary');
        fileBody.buffer = body;

        if (fileBody.buffer !== undefined && fileBody.buffer.length > 0) {
          req.body[fieldName].push(fileBody);
        } else {
          req.body[fieldName].push({
            originalname: '',
            filetype: '',
            size: 0,
            buffer: Buffer.from(''),
          });
        }
      } else {
        const textValue = body.toString('utf8');
        req.body[fieldName] = textValue.replace(/[\r\n]+$/, '');
      }
    });

    next();
  } catch (e) {
    console.log(80, e);
    throw e;
  }
};
