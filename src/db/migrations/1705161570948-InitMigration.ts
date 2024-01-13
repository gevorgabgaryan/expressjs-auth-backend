import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1705161570948 implements MigrationInterface {
  name = 'InitMigration1705161570948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying(25) NOT NULL, "last_name" character varying(25) NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_415c35b9b3b6fe45a3b065030f" ON "user_entity" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "photo_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_e3a5807b27c3b7e1f36c9e65fac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "client_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying(25) NOT NULL, "last_name" character varying(25) NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, "avatar" character varying NOT NULL DEFAULT 'default_avatar_url', CONSTRAINT "PK_b730a3f25cd74d13a5cb68cbc59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6293da38f0cd82179891e274d5" ON "client_entity" ("email") `);
    await queryRunner.query(
      `ALTER TABLE "photo_entity" ADD CONSTRAINT "FK_19cd6e42249b6491818b06a550e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "photo_entity" DROP CONSTRAINT "FK_19cd6e42249b6491818b06a550e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6293da38f0cd82179891e274d5"`);
    await queryRunner.query(`DROP TABLE "client_entity"`);
    await queryRunner.query(`DROP TABLE "photo_entity"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_415c35b9b3b6fe45a3b065030f"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
