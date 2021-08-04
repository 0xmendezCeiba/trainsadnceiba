import {MigrationInterface, QueryRunner} from "typeorm";

export class createTrainTable1627690027845 implements MigrationInterface {
  name = 'createTrainTable1627690027845';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "Train" (
        "id" SERIAL PRIMARY KEY,
        "passengerLimit" NUMERIC NOT NULL,
        "color" VARCHAR(7) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "passenger_limit_positive" CHECK ("passengerLimit" > 0)
      );`
      , undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE "Train";', undefined);
  }

}
