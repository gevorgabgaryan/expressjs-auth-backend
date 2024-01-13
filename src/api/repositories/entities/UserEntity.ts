import 'reflect-metadata';
import { Entity, Column, Index } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AutoMap } from '@nartc/automapper';

import { BaseEntity } from './BaseEntity';

@Entity()
export class UserEntity extends BaseEntity {
  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'first_name', type: 'varchar', length: 25 })
  public firstName: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'last_name', type: 'varchar', length: 25 })
  public lastName: string;

  @AutoMap()
  @IsEmail()
  @Index({ unique: true })
  @Column()
  public email: string;

  @AutoMap()
  @IsOptional()
  @Column({ name: 'password_hash' })
  public passwordHash: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'active', default: true })
  public isActive: boolean;
}
