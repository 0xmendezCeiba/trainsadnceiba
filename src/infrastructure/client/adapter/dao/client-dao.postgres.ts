import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

import { ClientDTO } from 'src/application/client/query/dto/client.dto'
import { ClientDAO } from 'src/domain/client/port/dao/client.dao';

@Injectable()
export class ClientDaoPostgres implements ClientDAO {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  public async searchByIdentityCode(identityCode: string): Promise<ClientDTO | null> {
    return this.entityManager.query(`
      SELECT
        "id",
        "identityCode",
        "fullName",
        "balance"
      FROM "Client"
      WHERE "identityCode" = $1
      LIMIT 1
    `, [identityCode]);
  }
};
