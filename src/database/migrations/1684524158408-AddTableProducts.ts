import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableProducts1684524158408 implements MigrationInterface {
  name = 'AddTableProducts1684524158408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hangTags" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, "name" character varying NOT NULL, "status" integer NOT NULL, "source" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1d1054dedc2f58c35f87c84f23" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hangTags"`);
  }
}
