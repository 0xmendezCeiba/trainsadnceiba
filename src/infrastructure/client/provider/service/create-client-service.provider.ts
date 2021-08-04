import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';

export function createClientServiceProvider(clientRepository: ClientRepository) {
  return new CreateClientService(clientRepository);
}
