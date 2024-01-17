import { AutoMap } from '@nartc/automapper';
import { BaseModel } from './BaseModel';

export class Photo extends BaseModel {
  @AutoMap()
  public name: string;

  @AutoMap()
  public url: string;
}
