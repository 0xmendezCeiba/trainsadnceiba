import { ClientDAO } from 'src/domain/client/port/dao/client.dao';
import { ClientDaoPostgres } from 'src/infrastructure/client/adapter/dao/client-dao.postgres';

export const clientDaoProvider = {
  provide: ClientDAO,
  useClass: ClientDaoPostgres,
};
