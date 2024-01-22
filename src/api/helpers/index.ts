import fs from 'fs/promises';
import * as path from 'path';
import { AppError } from '../../errors/AppError';
import logger from '../../lib/logger';
import { UploadedFile } from '../controllers/types/UploadFile';

export const deleteUploadedFiles = async (files: UploadedFile[]) => {
  for (const file of files) {
    try {
      const absolutePath = path.join(process.cwd(), file.path);

      await deleteImage(absolutePath);
    } catch (error) {
      logger.error(`Error deleting file ${file.path}:`, error);
      throw new AppError(`Error deleting file ${file.path}`);
    }
  }
};

const deleteImage = async (imagePath: string) => {
  await fs.stat(imagePath);
  await fs.unlink(imagePath);
};
