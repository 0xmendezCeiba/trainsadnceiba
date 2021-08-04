import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';

export function decreaseBalanceServiceProvider(clientRepository: ClientRepository) {
  return new DecreaseBalanceService(clientRepository);
}