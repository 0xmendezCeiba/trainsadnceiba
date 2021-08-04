import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Client } from 'src/domain/client/model/client';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { ClientEntity } from '../../entity/client.entity';

@Injectable()
export class ClientRepositoryPostgres implements ClientRepository {

  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  public async existsIdentityCode(identityCode: string): Promise<boolean> {
    return (await this.repository.count({ identityCode })) > 0;
  }

  public async create(client: Client) {
    const entity = new ClientEntity();
    entity.fullName = client.getFullName;
    entity.balance = client.getBalance;
    entity.identityCode = client.getIdentityCode;
    entity.createdAt = new Date();
    return await this.repository.save(entity);
  }

  public async update(id: number, client: Client) {
    const entity = await this.repository.findOne(id);
    entity.fullName = client.getFullName;
    entity.balance = client.getBalance;
    entity.identityCode = client.getIdentityCode;
    return await this.repository.save(entity);
  }

  public async getById(id: number):Promise<Client | null> {
    const record = await this.repository.findOne(id);
    if (record) {
      return new Client(record.fullName, record.identityCode, +record.balance);
    }
    return null;
  }

}
