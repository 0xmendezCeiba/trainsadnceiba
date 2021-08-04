import { Injectable } from '@nestjs/common';

import { CreateTrainCommand } from './create-train.command';
import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { Train } from 'src/domain/train/model/train';

@Injectable()
export class CreateTrainHandler {
  
  constructor(private readonly createTrainService: CreateTrainService) {}

  async execute(createTrainCommand: CreateTrainCommand) {
    const train = new Train(
      createTrainCommand.passengerLimit,
      createTrainCommand.color
    );
    return this.createTrainService.execute(train);
  }

}
