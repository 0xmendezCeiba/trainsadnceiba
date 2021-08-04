import { Injectable } from '@nestjs/common';

import { Train } from '../model/train';
import { TrainRepository } from '../port/repository/train.repository';

@Injectable()
export class CreateTrainService {

  constructor(
    private readonly trainRepository: TrainRepository,
  ) {}

  async existsTrainWithId(id: number): Promise<boolean> {
    const train = await this.trainRepository.getById(id);
    return train !== null;
  }

  async execute(train: Train) {
    return this.trainRepository.create(train);
  }

}
