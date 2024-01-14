import { Entity, Column, OneToMany } from 'typeorm';
import { IsUrl, ValidateNested } from 'class-validator';

import { PhotoEntity } from './PhotoEntity';
import { UserEntity } from './UserEntity';

@Entity()
export class ClientEntity extends UserEntity {
  @Column({ default: '/public/avatar.jpg' })
  @IsUrl()
  avatar: string;

  @OneToMany(() => PhotoEntity, (photo) => photo.user)
  @ValidateNested({ each: true })
  photos: PhotoEntity[];
}
