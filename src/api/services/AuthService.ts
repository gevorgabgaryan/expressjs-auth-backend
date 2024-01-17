import { Service } from 'typedi';
import { Repository } from 'typeorm';
import appDataSource from '../../db/dataSource';
import jwt from 'jsonwebtoken';
import { ClientEntity } from '../repositories/entities/ClientEntity';

import * as argon from 'argon2';

import { CustomError } from '../../errors/CustomError';
import { LoginBody } from '../controllers/requests/auth/LoginBody';
import config from '../../config';
import { Auth } from './models/Auth';
import logger from '../../lib/logger';

@Service()
export class AuthService {
  private clientRepository: Repository<ClientEntity> = appDataSource.getRepository(ClientEntity);

  async login(userData: LoginBody): Promise<Auth> {
    try {
      const user = await this.clientRepository.findOne({ where: { email: userData.email } });
      if (!user) throw new CustomError('credentials incorrect');
      const psMatches = await argon.verify(user.passwordHash, userData.password);
      if (!psMatches) throw new CustomError('credentials incorrect');
      return await this.signToken(user.id);
    } catch (e) {
      logger.error(e);
      throw e;
    }
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
