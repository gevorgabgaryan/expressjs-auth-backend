import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1705654198922 implements MigrationInterface {
  name = 'Migrations1705654198922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "photo_entity" ALTER COLUMN "name" SET DEFAULT 'Avatar'`);
    await queryRunner.query(`ALTER TABLE "photo_entity" ALTER COLUMN "url" SET DEFAULT '/public/images/avatar.jpg'`);
    await queryRunner.query(
      `ALTER TABLE "client_entity" ALTER COLUMN "avatar" SET DEFAULT '/public/images/avatar.jpg'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client_entity" ALTER COLUMN "avatar" SET DEFAULT '/public/avatar.jpg'`);
    await queryRunner.query(`ALTER TABLE "photo_entity" ALTER COLUMN "url" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "photo_entity" ALTER COLUMN "name" DROP DEFAULT`);
  }
}
