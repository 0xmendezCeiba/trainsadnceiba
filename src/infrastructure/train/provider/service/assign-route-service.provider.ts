import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { RouteAssignRepository } from 'src/domain/train/port/repository/route-assign.repository';
import { AssignRouteService } from 'src/domain/train/service/assign-route.service';

export function assignRouteServiceProvider(createTrainService: CreateTrainService, routeAssignRepository: RouteAssignRepository) {
  return new AssignRouteService(createTrainService, routeAssignRepository);
}
