import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import * as argon from 'argon2';
import { LoginBody } from '../controllers/requests/auth/LoginBody';
import config from '../../config';
import { Auth } from './models/Auth';
import { UnauthorizedError } from '../../errors/UnAuthorizedError';
import { BaseTransactionable } from './base/BaseTransactionable';
import { ClientRepository } from '../repositories/ClientRepository';

ClientRepository;
@Service()
export class AuthService extends BaseTransactionable {
  constructor() {
    super();
  }

  async login(userData: LoginBody): Promise<Auth> {
    const ttokenObj = await this.transaction(async (unitOfWork) => {
      const user = await unitOfWork.clientRepository.findUserByEmail(userData.email);
      if (!user) throw new UnauthorizedError();

      const psMatches = await argon.verify(user.passwordHash, userData.password);
      if (!psMatches) throw new UnauthorizedError();

      return await this.signToken(user.id);
    });
    return ttokenObj;
  }

  async signToken(userId: string): Promise<Auth> {
    const payload = {
      id: userId,
    };
    const secret = config.JWTSecret;
    const expiresIn = config.JWTExpireIn;

    const token = jwt.sign(payload, secret, { expiresIn });
    const result = new Auth();
    result.token = token;
    return result;
  }
}
