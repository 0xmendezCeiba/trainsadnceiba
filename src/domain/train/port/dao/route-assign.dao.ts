import { RouteAssignDTO } from 'src/application/train/query/dto/route-assign.dto';

export abstract class RouteAssignDAO {

  abstract listAll(): Promise<RouteAssignDTO[]>;

};
