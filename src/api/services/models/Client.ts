import { AutoMap } from '@nartc/automapper';
import { Photo } from './Photo';
import { User } from './User';

export class Client extends User {
  @AutoMap()
  public avatar: string;

  @AutoMap(() => Photo)
  public photos: Photo[];

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
