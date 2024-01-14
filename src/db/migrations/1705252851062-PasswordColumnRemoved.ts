import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordColumnRemoved1705252851062 implements MigrationInterface {
  name = 'PasswordColumnRemoved1705252851062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "client_entity" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "client_entity" ALTER COLUMN "avatar" SET DEFAULT '/public/avatar.jpg'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client_entity" ALTER COLUMN "avatar" SET DEFAULT 'default_avatar_url'`);
    await queryRunner.query(`ALTER TABLE "client_entity" ADD "password" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "password" character varying NOT NULL`);
  }
}
