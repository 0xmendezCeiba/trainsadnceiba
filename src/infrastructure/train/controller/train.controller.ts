import {Controller, Post, UsePipes, Body, ValidationPipe, Get } from '@nestjs/common';

import { CreateTrainCommand } from 'src/application/train/command/create-train.command';
import { AssignRouteCommand } from 'src/application/train/command/assign-route.command';
import { CreateTrainHandler } from 'src/application/train/command/create-train.handler';
import { AssignRouteHandler } from 'src/application/train/command/assign-route.handler';
import { AddPassengerCommand } from 'src/application/train/command/add-passenger.command';
import { AddPassengerHandler } from 'src/application/train/command/add-passenger.handler';
import { ListTrainsHandler } from 'src/application/train/query/list-trains.handler';
import { ListRouteAssignHandler } from 'src/application/train/query/list-route-assign';

@Controller('trains')
export class TrainController {

  constructor(
    private readonly createTrainHandler: CreateTrainHandler,
    private readonly assignRouteHandler: AssignRouteHandler,
    private readonly addPassengerHandler: AddPassengerHandler,
    private readonly listTrainsHandler: ListTrainsHandler,
    private readonly listRouteAssignHandler: ListRouteAssignHandler,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTrainCommand: CreateTrainCommand) {
    return this.createTrainHandler.execute(createTrainCommand);
  }

  @Get()
  async listTrains() {
    return this.listTrainsHandler.execute();
  }

  @Post('/route')
  @UsePipes(new ValidationPipe({ transform: true }))
  async assignRoute(@Body() assignRouteCommand: AssignRouteCommand) {
    return this.assignRouteHandler.execute(assignRouteCommand);
  }

  @Get('/route')
  async listRouteAssign() {
    return this.listRouteAssignHandler.execute();
  }

  @Post('/passenger')
  @UsePipes(new ValidationPipe({ transform: true }))
  async assignPassengerToTrain(@Body() addPassengerCommand: AddPassengerCommand) {
    return this.addPassengerHandler.execute(addPassengerCommand);
  }

}
