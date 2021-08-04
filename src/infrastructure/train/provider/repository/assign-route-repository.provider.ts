import { RouteAssignRepository } from "src/domain/train/port/repository/route-assign.repository";
import { RouteAssignRepositoryPostgres } from "../../adapter/repository/route-assign-repository.postgres";

export const routeAssignRepositoryProvider = {
  provide: RouteAssignRepository,
  useClass: RouteAssignRepositoryPostgres,
};
