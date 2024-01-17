import { AutoMap } from '@nartc/automapper';
import { BaseModel } from './BaseModel';
import { Photo } from './Photo';

export class User extends BaseModel {
  @AutoMap()
  public firstName: string;

  @AutoMap()
  public lastName: string;

  @AutoMap()
  public email: string;

  @AutoMap()
  public passwordHash: string;

  @AutoMap()
  public isActive: boolean;

  @AutoMap()
  public role: string;

  @AutoMap(() => Photo)
  public photos: Photo[];

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
