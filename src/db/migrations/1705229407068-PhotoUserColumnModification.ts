import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhotoUserColumnModification1705229407068 implements MigrationInterface {
  name = 'PhotoUserColumnModification1705229407068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "photo_entity" DROP CONSTRAINT "FK_19cd6e42249b6491818b06a550e"`);
    await queryRunner.query(
      `ALTER TABLE "photo_entity" ADD CONSTRAINT "FK_19cd6e42249b6491818b06a550e" FOREIGN KEY ("userId") REFERENCES "client_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "photo_entity" DROP CONSTRAINT "FK_19cd6e42249b6491818b06a550e"`);
    await queryRunner.query(
      `ALTER TABLE "photo_entity" ADD CONSTRAINT "FK_19cd6e42249b6491818b06a550e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
