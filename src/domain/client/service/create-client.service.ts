import { Injectable } from '@nestjs/common';

import { Client } from '../model/client';
import { ClientRepository } from '../port/repository/client.repository';
import { DomainError } from 'src/domain/errors/domain.error';

@Injectable()
export class CreateClientService {

  constructor(private readonly clientRepository: ClientRepository) {}

  private async validateNotClientExists(identityCode: string) {
    const existsIdentityCode = await this.clientRepository.existsIdentityCode(identityCode);
    if (existsIdentityCode) {
      throw new DomainError(`The identity code ${identityCode} is already registered`);
    }
  }

  public async clientExists(clientId: number): Promise<boolean> {
    const client = await this.clientRepository.getById(clientId);
    return client !== null;
  }

  async execute(client: Client) {
    await this.validateNotClientExists(client.getIdentityCode);
    return this.clientRepository.create(client);
  }
  
}
