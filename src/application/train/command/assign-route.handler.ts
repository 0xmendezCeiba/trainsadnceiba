import { Injectable } from '@nestjs/common';

import { AssignRouteService } from 'src/domain/train/service/assign-route.service';
import { AssignRouteCommand } from './assign-route.command';
import { RouteAssign } from 'src/domain/train/model/route-assign';

@Injectable()
export class AssignRouteHandler {

  constructor(private readonly assignRouteService: AssignRouteService) {}

  public async execute(assignRouteCommand: AssignRouteCommand) {
    const routeAssign = new RouteAssign(
      assignRouteCommand.trainId,
      new Date(assignRouteCommand.startAt),
      new Date(assignRouteCommand.endAt),
      assignRouteCommand.passengerPrice,
      assignRouteCommand.roadCode,
    );
    return this.assignRouteService.execute(routeAssign);
  }

}
