import { Entity, Column, OneToMany } from 'typeorm';
import { IsUrl, ValidateNested } from 'class-validator';

import { PhotoEntity } from './PhotoEntity';
import { UserEntity } from './UserEntity';
import { AutoMap } from '@nartc/automapper';
@Entity()
export class ClientEntity extends UserEntity {
  @AutoMap()
  @Column({ default: '/public/images/avatar.jpg' })
  @IsUrl()
  avatar: string;

  @AutoMap()
  @OneToMany(() => PhotoEntity, (photo) => photo.user)
  @ValidateNested({ each: true })
  photos: PhotoEntity[];
}
