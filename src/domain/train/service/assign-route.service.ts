import { RouteAssign } from '../model/route-assign';
import { CreateTrainService } from '../service/create-train.service';
import { RouteAssignRepository } from '../port/repository/route-assign.repository';
import { DomainError } from 'src/domain/errors/domain.error';
import { NotFoundError } from 'src/domain/errors/not-found.error';

export class AssignRouteService {

  constructor(
    private readonly createTrainService: CreateTrainService,
    private readonly routeAssignRepository: RouteAssignRepository,
  ) {}

  private async validateTrainExists(trainId: number) {
    const existsTrain = await this.createTrainService.existsTrainWithId(trainId);
    if (!existsTrain) {
      throw new NotFoundError('Train not found');
    }
  }

  private async validateFreeRoads(startAt: Date, endAt: Date, roadCode: string) {
    const busyRoads = await this.routeAssignRepository.getBetweenDates(startAt, endAt);
    const busyRoadsForRoadCode = busyRoads.filter(record => record.getRoadCode === roadCode);
    if (busyRoadsForRoadCode.length) {
      throw new DomainError(`This time interval is busy for road ${roadCode}`);
    }
  }

  private async validateFreeTrain(trainId: number, startAt: Date, endAt: Date) {
    const busyTrains = await this.routeAssignRepository.getBetweenDates(startAt, endAt);
    const busyTrainsForId = busyTrains.filter(record => record.getTrainId === trainId);
    if (busyTrainsForId.length) {
      throw new DomainError(`Train busy for time interval`);
    }
  }

  public async execute(routeAssign: RouteAssign) {
    await this.validateTrainExists(routeAssign.getTrainId);
    await this.validateFreeRoads(routeAssign.getStartAt, routeAssign.getEndAt, routeAssign.getRoadCode);
    await this.validateFreeTrain(routeAssign.getTrainId, routeAssign.getStartAt, routeAssign.getEndAt);
    return this.routeAssignRepository.create(routeAssign);
  }

  public async isAvalaibleRouteAssignWithId(id: number): Promise<boolean> {
    const routeAssign = await this.routeAssignRepository.getById(id);
    if (!routeAssign) {
      throw new NotFoundError('Route assign not found');
    }
    const currentDate = new Date();
    return routeAssign.getStartAt.getTime() > currentDate.getTime();
  }

  public async routeAssignExistsWithId(id: number): Promise<boolean> {
    const routeAssign = await this.routeAssignRepository.getById(id);
    return routeAssign !== null;
  }

  public async getById(id: number) {
    return this.routeAssignRepository.getById(id);
  }

}
