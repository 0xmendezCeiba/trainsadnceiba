import {Controller, Post, UsePipes, Body, ValidationPipe } from '@nestjs/common';

import { CreateTrainCommand } from 'src/application/train/command/create-train.command';
import { AssignRouteCommand } from 'src/application/train/command/assign-route.command';
import { CreateTrainHandler } from "src/application/train/command/create-train.handler";
import { AssignRouteHandler } from "src/application/train/command/assign-route.handler";
import { AddPassengerCommand } from "src/application/train/command/add-passenger.command";
import { AddPassengerHandler } from "src/application/train/command/add-passenger.handler";

@Controller('trains')
export class TrainController {

  constructor(
    private readonly createTrainHandler: CreateTrainHandler,
    private readonly assignRouteHandler: AssignRouteHandler,
    private readonly addPassengerHandler: AddPassengerHandler,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTrainCommand: CreateTrainCommand) {
    return await this.createTrainHandler.execute(createTrainCommand);
  }

  @Post('/route')
  @UsePipes(new ValidationPipe({ transform: true }))
  async assignRoute(@Body() assignRouteCommand: AssignRouteCommand) {
    return await this.assignRouteHandler.execute(assignRouteCommand);
  }

  @Post('/passenger')
  @UsePipes(new ValidationPipe({ transform: true }))
  async assignPassengerToTrain(@Body() addPassengerCommand: AddPassengerCommand) {
    return this.addPassengerHandler.execute(addPassengerCommand);
  }

}
