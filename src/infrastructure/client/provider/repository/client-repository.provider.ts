import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { ClientRepositoryPostgres } from 'src/infrastructure/client/adapter/repository/client-repository.postgres';

export const clientRepositoryProvider = {
  provide: ClientRepository,
  useClass: ClientRepositoryPostgres,
};
