import { Post, JsonController, UseBefore, Req, Body } from 'routing-controllers';
import { Request } from 'express';
import { ClientCreateBody } from './requests/client/ClientCreateBody';
import { ClientService } from '../services/ClientService';
import { Service } from 'typedi';
import { fileUploadMiddleware } from './middlewares/fileUploadMiddleware ';
import { Mapper } from '@nartc/automapper';
import { ClientCreateResponse } from './responses/client/ClientCreateResponse';
import { LoginBody } from './requests/auth/LoginBody';
import { AuthResponse } from './responses/auth/LoginResponse';
import { AuthService } from '../services/AuthService';
import { AppError } from '../../errors/AppError';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Service()
@JsonController()
@OpenAPI({ security: [{ basicAuth: [] }] })
export class AuthController {
  constructor(
    private clientService: ClientService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  @UseBefore(fileUploadMiddleware)
  @ResponseSchema(ClientCreateResponse)
  async register(@Body() body: ClientCreateBody, @Req() req: Request): Promise<ClientCreateResponse> {
    if (!req.is('multipart/form-data')) {
      throw new AppError('Unsupported content type, expecting multipart/form-data');
    }

    const newClient = await this.clientService.addClient(body);
    return Mapper.map(newClient, ClientCreateResponse);
  }

  @Post('/login')
  @ResponseSchema(AuthResponse)
  public async login(@Req() req: Request, @Body() body: LoginBody): Promise<AuthResponse> {
    const auth = await this.authService.login(body);
    return Mapper.map(auth, AuthResponse);
  }
}
