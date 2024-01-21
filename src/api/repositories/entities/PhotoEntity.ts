import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsUrl, IsString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { ClientEntity } from './ClientEntity';
import { AutoMap } from '@nartc/automapper';

@Entity()
export class PhotoEntity extends BaseEntity {
  @AutoMap()
  @Column({ default: 'Avatar' })
  @IsString()
  name: string;

  @AutoMap()
  @Column({ default: '/public/images/avatar.jpg' })
  @IsUrl()
  url: string;

  @AutoMap()
  @ManyToOne(() => ClientEntity, (client) => client.photos)
  user: ClientEntity;
}
