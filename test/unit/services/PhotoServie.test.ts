import { PhotoService } from '../../../src/api/services/PhotoService';
import { UnitOfWorkMock } from '../UnitOfWorkMock/UnitOfWorkMock';
import { FileBody } from '../../../src/api/controllers/requests/file/FileBody';
import { Photo } from '../../../src/api/services/models/Photo';
import { Client } from '../../../src/api/services/models/Client';
import { UnitOfWork } from '../../../src/api/repositories/unitOfWork/UnitOfWork';
import { BaseTransactionable } from '../../../src/api/services/base/BaseTransactionable';

describe('PhotoService', () => {
  let photoService: PhotoService;
  let unitOfWork: UnitOfWork;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (BaseTransactionable.prototype.transaction as jest.Mock) = jest.fn((runInTransaction: any) => {
        return runInTransaction(unitOfWork);
      });
    unitOfWork = UnitOfWorkMock();
    photoService = new PhotoService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('savePhotos', () => {
    it('should save photos successfully', async () => {
      const client = new Client(); // You may need to provide valid client data
      const files: FileBody[] = [
        { originalname: 'photo1.jpg', buffer: Buffer.from('image data 1'), size: 25500, filetype:  'png' },
        { originalname: 'photo2.jpg', buffer: Buffer.from('image data 2'), size: 25500, filetype:  'jpg'  },
      ];

      jest.spyOn(unitOfWork.photoRepository, 'savePhoto').mockImplementation(async (photo: Photo) => {
        return Promise.resolve(photo);
      });

      jest.spyOn(photoService, 'writeFile').mockImplementation(async () => {

      });

      const result = await photoService.savePhotos(files, client, unitOfWork);

      expect(result).toHaveLength(2);


      expect(result[0]).toBeInstanceOf(Photo);
      expect(result[1]).toBeInstanceOf(Photo);
      expect(result[0].user).toBe(client);
      expect(result[1].user).toBe(client);

    });


  });
});
