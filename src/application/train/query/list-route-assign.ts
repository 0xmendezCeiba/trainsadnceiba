import { Injectable } from '@nestjs/common';

import { RouteAssignDAO } from 'src/domain/train/port/dao/route-assign.dao';
import { RouteAssignDTO } from './dto/route-assign.dto';

@Injectable()
export class ListRouteAssignHandler {

  constructor(private readonly routeAssignDao: RouteAssignDAO) {}

  async execute(): Promise<RouteAssignDTO[]> {
    return this.routeAssignDao.listAll();
  }

};
