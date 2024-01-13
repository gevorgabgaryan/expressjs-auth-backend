import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, IsString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './UserEntity';

@Entity()
export class PhotoEntity extends BaseEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  url: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
