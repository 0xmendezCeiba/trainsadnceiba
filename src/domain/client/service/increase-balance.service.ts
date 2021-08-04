import { BalanceChange } from '../model/balance-change';
import { ClientRepository } from '../port/repository/client.repository';
import { Client } from '../model/client';
import { NotFoundError } from 'src/domain/errors/not-found.error';

export class IncreaseBalanceService {

  constructor(private readonly clientRepository: ClientRepository) {}

  private async validateClientExists(clientId: number): Promise<Client> {
    const client = await this.clientRepository.getById(clientId);
    if (!client) {
      throw new NotFoundError('Client not found');
    }
    return client;
  }

  public async execute(increaseBalance: BalanceChange) {
    const client = await this.validateClientExists(increaseBalance.getClientId);
    const newBalance = client.getBalance + increaseBalance.getValue;
    return this.clientRepository.update(
      increaseBalance.getClientId,
      new Client(client.getFullName, client.getIdentityCode, newBalance)
    );
  }

}
