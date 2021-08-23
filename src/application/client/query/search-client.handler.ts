import { Injectable } from '@nestjs/common';

import { ClientDAO } from 'src/domain/client/port/dao/client.dao';
import { ClientDTO } from './dto/client.dto';

@Injectable()
export class SearchClientHandler {
  constructor(
    private readonly clientDao: ClientDAO,
  ) { }

  public async execute(identityCode: string): Promise<ClientDTO | null> {
    return this.clientDao.searchByIdentityCode(identityCode);
  }
}
