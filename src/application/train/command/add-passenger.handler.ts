import { Injectable } from '@nestjs/common';

import { AddPassengerCommand } from "./add-passenger.command";
import { PassengerBoarding } from "src/domain/train/model/passenger-boarding";
import { AddPassengerService } from "src/domain/train/service/add-passenger.service";

@Injectable()
export class AddPassengerHandler {
  
  constructor(private readonly addPassengerService: AddPassengerService) {}

  public async execute(addPassengerCommand: AddPassengerCommand) {
    const passengerBoarding = new PassengerBoarding(addPassengerCommand.routeAssignId, addPassengerCommand.clientId);
    return await this.addPassengerService.execute(passengerBoarding);
  }
  
}
