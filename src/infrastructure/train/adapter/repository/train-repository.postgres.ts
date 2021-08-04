import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Train } from 'src/domain/train/model/train';
import { TrainEntity } from "../../entity/train.entity";
import { TrainRepository } from 'src/domain/train/port/repository/train.repository';

@Injectable()
export class TrainRepositoryPostgres implements TrainRepository {

  constructor(
    @InjectRepository(TrainEntity)
    private readonly repository: Repository<TrainEntity>
  ) {}

  async create(train: Train) {
    const entity = new TrainEntity();
    entity.color = train.getColor;
    entity.passengerLimit = train.getPassengerLimit;
    entity.createdAt = new Date();
    return await this.repository.save(entity);
  }

  async getById(id: number): Promise<Train | null> {
    const record = await this.repository.findOne(id);
    if (record) {
      return new Train(
        +record.passengerLimit,
        record.color,
      );
    }
    return null;
  };

}
