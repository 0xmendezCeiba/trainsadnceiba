import { RouteAssignDAO } from 'src/domain/train/port/dao/route-assign.dao';
import { RouteAssignDAOPostgres } from 'src/infrastructure/train/adapter/dao/route-assign-dao.postgres';

export const routeAssignDAOProvider = {
  provide: RouteAssignDAO,
  useClass: RouteAssignDAOPostgres,
};
