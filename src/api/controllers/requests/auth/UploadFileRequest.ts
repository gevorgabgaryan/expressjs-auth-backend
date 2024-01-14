import { Request } from 'express';
import { UploadedFile } from '../../types/UploadFile';

export interface UploadFileRequest extends Request {
  files: UploadedFile[];
}
