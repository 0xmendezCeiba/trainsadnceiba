import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { TrainDAO } from 'src/domain/train/port/dao/train.dao';
import { TrainDTO } from 'src/application/train/query/dto/train.dto';

@Injectable()
export class TrainDAOPostgres implements TrainDAO {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  public async listAll(): Promise<TrainDTO[]> {
    return this.entityManager.query(`
      SELECT
        "id",
        "color",
        "passengerLimit"
      FROM "Train"
      ORDER BY "createdAt" ASC
    `);
  }

};