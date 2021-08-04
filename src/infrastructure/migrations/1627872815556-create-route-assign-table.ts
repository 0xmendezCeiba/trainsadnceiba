import {MigrationInterface, QueryRunner} from 'typeorm';

export class createRouteAssignTable1627872815556 implements MigrationInterface {
  name = 'createRouteAssignTable1627872815556';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "RouteAssign" (
        "id" SERIAL PRIMARY KEY,
        "trainId" INTEGER NOT NULL,
        "startAt" TIMESTAMP NOT NULL,
        "endAt" TIMESTAMP NOT NULL,
        "passengerPrice" NUMERIC NOT NULL,
        "roadCode" VARCHAR(10) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_train FOREIGN KEY ("trainId") REFERENCES "Train"("id")
      );`
      , undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "RouteAssign";', undefined);
  }

}
