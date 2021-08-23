import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { RouteAssignDAO } from 'src/domain/train/port/dao/route-assign.dao';
import { RouteAssignDTO } from 'src/application/train/query/dto/route-assign.dto';

@Injectable()
export class RouteAssignDAOPostgres implements RouteAssignDAO {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  public async listAll(): Promise<RouteAssignDTO[]> {
    return this.entityManager.query(`
      SELECT
        ra."id" as "routeAssignId",
        t."id" as "trainId",
        t."color",
        t."passengerLimit",
        ra."passengerPrice",
        ra."roadCode",
        ra."startAt",
        ra."endAt"
      FROM "Train" as t INNER JOIN "RouteAssign" as ra
        ON t."id" = ra."trainId"
      WHERE ra."startAt" > NOW()
      ORDER BY ra."startAt" ASC
    `);
  }

}
