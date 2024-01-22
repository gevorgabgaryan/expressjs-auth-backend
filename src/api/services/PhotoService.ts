import { Service } from 'typedi';
import * as fs from 'fs/promises'; // Import fs.promises directly
import * as path from 'path';
import { FileBody } from '../controllers/requests/file/FileBody';
import config from '../../config';
import { UnitOfWork } from '../repositories/unitOfWork/UnitOfWork';
import { Photo } from './models/Photo';
import { Client } from './models/Client';
import { BaseService } from './BaseService';

@Service()
export class PhotoService extends BaseService {
  constructor() {
    super();
  }

  public async savePhotos(files: FileBody[], client: Client, unitOfWork: UnitOfWork): Promise<Photo[]> {
    const savedPhotos: Photo[] = [];
    for (const file of files) {
      const photo = new Photo();
      this.addIdAndTimestamps(photo);
      const imageName = this.getImageName(photo.id, file.originalname);
      const photoPath = this.getPhotoPath(imageName);
      await this.writeFile(file, photoPath);
      photo.name = imageName;
      photo.url = photoPath;
      photo.user = client;
      const savedPhoto = await unitOfWork.photoRepository.savePhoto(photo);
      savedPhotos.push(savedPhoto);
    }
    return savedPhotos;
  }

  public async writeFile(file: FileBody, photoPath: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), photoPath);
    const dirPath = path.dirname(absolutePath);
    await this.ensureDirExists(dirPath);
    await fs.writeFile(absolutePath, file.buffer, 'binary');
  }

  private getPhotoPath(imageName: string): string {
    const now = new Date();
    const dateFolder = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    const uploadDir = path.join(config.userAvatarDir, dateFolder);
    const photoPath = `${uploadDir}/${imageName}`;
    return photoPath;
  }

  private getImageName(id: string, originalName: string): string {
    return `${id}_${originalName}`;
  }

  private async ensureDirExists(dirPath: string) {
    try {
      await fs.access(dirPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dirPath, { recursive: true });
      } else {
        throw error;
      }
    }
  }
}
