import { Injectable } from '@nestjs/common';

import { BalanceChange } from '../model/balance-change';
import { ClientRepository } from '../port/repository/client.repository';
import { Client } from '../model/client';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { DomainError } from 'src/domain/errors/domain.error';

Injectable()
export class DecreaseBalanceService {

  constructor(private readonly clientRepository: ClientRepository) {}

  private async validateClientExists(clientId: number): Promise<Client> {
    const client = await this.clientRepository.getById(clientId);
    if (!client) throw new NotFoundError('Client not found');
    return client;
  }

  private async validateDecrementValue(balance: number, value: number) {
    const isValidDecrement = (balance - value) >= 0;
    if (!isValidDecrement) throw new DomainError('Insufficient balance');
  }

  public async execute(decreaseBalance: BalanceChange) {
    const client = await this.validateClientExists(decreaseBalance.getClientId);
    await this.validateDecrementValue(client.getBalance, decreaseBalance.getValue);
    const newBalance = client.getBalance - decreaseBalance.getValue;
    return await this.clientRepository.update(
      decreaseBalance.getClientId,
      new Client(client.getFullName, client.getIdentityCode, newBalance)
    );
  }

}
