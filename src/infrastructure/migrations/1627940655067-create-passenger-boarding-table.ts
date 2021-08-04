import {MigrationInterface, QueryRunner} from 'typeorm';

export class createPassengerBoardingTable1627940655067 implements MigrationInterface {
  name = 'createPassengerBoardingTable1627940655067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PassengerBoarding" (
        "id" SERIAL PRIMARY KEY,
        "clientId" INTEGER NOT NULL,
        "routeAssignId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_client FOREIGN KEY ("clientId") REFERENCES "Client"("id"),
        CONSTRAINT fk_route_assing FOREIGN KEY ("routeAssignId") REFERENCES "RouteAssign"("id")
      );`
      , undefined);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "PassengerBoarding";', undefined);
  }

}
