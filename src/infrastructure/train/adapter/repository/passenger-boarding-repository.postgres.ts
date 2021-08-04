import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PassengerBoarding } from 'src/domain/train/model/passenger-boarding';
import { PassengerBoardingRepository } from 'src/domain/train/port/repository/passenger-boarding.repository';
import { PassengerBoardingEntity } from '../../entity/passenger-boarding.entity';

@Injectable()
export class PassengerBoardingRepositoryPostgres implements PassengerBoardingRepository {

  constructor(
    @InjectRepository(PassengerBoardingEntity)
    private readonly repository: Repository<PassengerBoardingEntity>
  ) {}

  async create(passengerBoarding: PassengerBoarding) {
    const entity = new PassengerBoardingEntity();
    entity.clientId = passengerBoarding.getClientId;
    entity.routeAssignId = passengerBoarding.getRouteAssignId;
    entity.createdAt = new Date();
    return await this.repository.save(entity);

  }

  async getLastPassengerBoardingForClient(clientId: number): Promise<PassengerBoarding | null> {
    const record = await  this.repository.findOne({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
    if (record) {
      return new PassengerBoarding(record.routeAssignId, record.clientId);
    }
    return null;
  }

}