import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, IsString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { ClientEntity } from './ClientEntity';
import { AutoMap } from '@nartc/automapper';

@Entity()
export class PhotoEntity extends BaseEntity {
  @AutoMap()
  @Column()
  @IsString()
  name: string;

  @AutoMap()
  @Column()
  @IsUrl()
  url: string;

  @AutoMap()
  @ManyToOne(() => ClientEntity, (client) => client.photos)
  user: ClientEntity;
}
