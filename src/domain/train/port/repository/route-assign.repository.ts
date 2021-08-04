import { RouteAssign } from '../../model/route-assign';

export abstract class RouteAssignRepository {

  abstract create(routeAssign: RouteAssign);
  abstract getBetweenDates(startAt: Date, endAt: Date): Promise<RouteAssign[]>;
  abstract getById(id: number): Promise<RouteAssign | null>;

}
