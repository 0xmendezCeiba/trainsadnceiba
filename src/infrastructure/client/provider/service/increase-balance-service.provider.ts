import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';

export function increaseBalanceServiceProvider(clientRepository: ClientRepository) {
  return new IncreaseBalanceService(clientRepository);
}
