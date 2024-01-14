import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, IsString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { ClientEntity } from './ClientEntity';

@Entity()
export class PhotoEntity extends BaseEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  url: string;

  @ManyToOne(() => ClientEntity, (client) => client.photos)
  user: ClientEntity;
}
