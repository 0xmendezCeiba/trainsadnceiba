import { Injectable } from '@nestjs/common';

import { TrainDAO } from 'src/domain/train/port/dao/train.dao';
import { TrainDTO } from './dto/train.dto';

@Injectable()
export class ListTrainsHandler {

  constructor(private readonly trainDao: TrainDAO) {}

  async execute(): Promise<TrainDTO[]> {
    return this.trainDao.listAll();
  }

}
