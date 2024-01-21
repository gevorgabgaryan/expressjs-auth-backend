import { PhotoEntity } from './entities/PhotoEntity';
import appDataSource from '../../db/dataSource';
import { Mapper } from '@nartc/automapper';
import { Photo } from '../services/models/Photo';

export const PhotoRepository = appDataSource.getRepository(PhotoEntity).extend({
  async savePhoto(photo: Photo): Promise<Photo> {
    const photoEntity = Mapper.map(photo, PhotoEntity);
    const savedPhoto = await this.save(photoEntity);
    return Mapper.map(savedPhoto, Photo);
  },
});
