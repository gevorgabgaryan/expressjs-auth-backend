import argon from 'argon2';
import { LoginBody } from "../../../src/api/controllers/requests/auth/LoginBody";
import { UnitOfWork } from "../../../src/api/repositories/unitOfWork/UnitOfWork";
import { AuthService } from "../../../src/api/services/AuthService";
import { Client } from '../../../src/api/services/models/Client';
import { UnauthorizedError } from '../../../src/errors/UnAuthorizedError';
import { UnitOfWorkMock } from "../UnitOfWorkMock/UnitOfWorkMock";
import { BaseTransactionable } from '../../../src/api/services/base/BaseTransactionable';

describe('AuthService', () => {
  let authService: AuthService;
  let unitOfWork: UnitOfWork;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (BaseTransactionable.prototype.transaction as jest.Mock) = jest.fn((runInTransaction: any) => {
        return runInTransaction(unitOfWork);
      });
    unitOfWork = UnitOfWorkMock();
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const userData: LoginBody = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const user = new Client();
      jest.spyOn(unitOfWork.clientRepository, 'findUserByEmail').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);
      jest.spyOn(authService, 'signToken').mockResolvedValueOnce({ token: 'someToken' });

      const result = await authService.login(userData);

      expect(result).toEqual({ token: 'someToken' });
    });

    it('should throw UnauthorizedError if user is not found', async () => {
      const userData: LoginBody = {
        email: 'nonexistent.email@example.com',
        password: 'password123',
      };
      jest.spyOn(unitOfWork.clientRepository, 'findUserByEmail').mockResolvedValueOnce(null);

      await expect(authService.login(userData)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if password does not match', async () => {
      const userData: LoginBody = {
        email: 'john.doe@example.com',
        password: 'invalidPassword',
      };
      const user = new Client();
      jest.spyOn(unitOfWork.clientRepository, 'findUserByEmail').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(authService.login(userData)).rejects.toThrow(UnauthorizedError);
    });
  });

});
