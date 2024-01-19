import { PhotoEntity } from './entities/PhotoEntity';
import appDataSource from '../../db/dataSource';

export const PhotoRepository = appDataSource.getRepository(PhotoEntity).extend({
  async savePhoto(photo: PhotoEntity): Promise<PhotoEntity> {
    return this.save(photo);
  },
});
