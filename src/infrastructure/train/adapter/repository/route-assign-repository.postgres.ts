import { Injectable } from '@nestjs/common';
import { Repository, In, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RouteAssign } from 'src/domain/train/model/route-assign';
import { RouteAssignEntity } from "../../entity/route-assign.entity";
import { RouteAssignRepository } from 'src/domain/train/port/repository/route-assign.repository';

@Injectable()
export class RouteAssignRepositoryPostgres implements RouteAssignRepository {

  constructor(
    @InjectRepository(RouteAssignEntity)
    private readonly repository: Repository<RouteAssignEntity>
  ) {}

  async create(routeAssign: RouteAssign) {
    const entity = new RouteAssignEntity();
    entity.trainId = routeAssign.getTrainId;
    entity.passengerPrice = routeAssign.getPassengerPrice;
    entity.roadCode = routeAssign.getRoadCode;
    entity.startAt = routeAssign.getStartAt;
    entity.endAt = routeAssign.getEndAt;
    entity.createdAt = new Date();
    return await this.repository.save(entity);
  }

  async getById(id: number) {
    const record = await this.repository.findOne(id);
    if (record) {
      return new RouteAssign(
        record.trainId,
        record.startAt,
        record.endAt,
        record.passengerPrice,
        record.roadCode,
      );
    }
    return null;
  }

  async getBetweenDates(startAt: Date, endAt: Date): Promise<RouteAssign[]> {
    const validRecordsId = await this.repository.find({
      where: [
        { endAt: LessThanOrEqual(startAt) },
        { startAt: MoreThanOrEqual(endAt) },
      ],
    });

    const ids = validRecordsId.map(({ id }) => id);
    const records = await this.repository.find({
      where: ids.length ? { id: Not(In(ids)) } : {},
    });
    return records.map(
      record => new RouteAssign(record.trainId, record.startAt, record.endAt, record.passengerPrice, record.roadCode)
    );
  }

}
