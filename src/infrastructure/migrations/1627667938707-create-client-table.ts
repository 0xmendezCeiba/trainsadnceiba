import { MigrationInterface, QueryRunner } from 'typeorm';

export class createClientTable1627667938707 implements MigrationInterface {
  name = 'createClientTable1627667938707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Client" (
        "id" SERIAL PRIMARY KEY,
        "identityCode" VARCHAR(50) NOT NULL,
        "fullName" VARCHAR(70) NOT NULL,
        "balance" NUMERIC NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "identityCode_unique" UNIQUE ("identityCode")
      );`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "Client"', undefined);
  }

}
