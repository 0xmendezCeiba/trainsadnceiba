import { PassengerBoarding } from '../model/passenger-boarding';
import { PassengerBoardingRepository } from '../port/repository/passenger-boarding.repository';
import { AssignRouteService } from './assign-route.service';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { DomainError } from 'src/domain/errors/domain.error';
import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { BalanceChange } from 'src/domain/client/model/balance-change';

export class AddPassengerService {

  constructor(
    private readonly assignRouteService: AssignRouteService,
    private readonly createClientService: CreateClientService,
    private readonly decreaseBalanceService: DecreaseBalanceService,
    private readonly passengerBoardingRepository: PassengerBoardingRepository,
  ) {}

  private async validateClientExists(clientId: number) {
    const clientExists = await this.createClientService.clientExists(clientId);
    if (!clientExists) {
      throw new NotFoundError('Client not found');
    }
  }

  private async validateRouteAssignExists(routeAssignId: number) {
    const routeAssignExists = await this.assignRouteService.routeAssignExistsWithId(routeAssignId);
    if (!routeAssignExists) {
      throw new NotFoundError('Route assign not found');
    }
  }

  private async validateRouteAssignAvailable(routeAssignId: number) {
    const routeAssignAvailable = await this.assignRouteService.isAvalaibleRouteAssignWithId(routeAssignId);
    if (!routeAssignAvailable) {
      throw new DomainError('Route assign not available');
    }
  }

  private async validateWithLastPassengerBoarding(passengerBoarding: PassengerBoarding) {
    const lastPassengerBoarding = await this.passengerBoardingRepository.getLastPassengerBoardingForClient(passengerBoarding.getClientId);
    if (lastPassengerBoarding) {
      const isDuplicatedBoarding = lastPassengerBoarding.getRouteAssignId === passengerBoarding.getRouteAssignId;
      if (isDuplicatedBoarding) {
        throw new DomainError('Duplicated passenger boarding');
      }
      
      const currentRouteAssign = await this.assignRouteService.getById(passengerBoarding.getRouteAssignId);
      const lastRouteAssign = await this.assignRouteService.getById(lastPassengerBoarding.getRouteAssignId);
      const isValidOverlappingRoad = currentRouteAssign.getEndAt.getTime() < lastRouteAssign.getStartAt.getTime() ||
        lastRouteAssign.getEndAt.getTime() < currentRouteAssign.getStartAt.getTime();
      if (!isValidOverlappingRoad) {
        throw new DomainError('Overlapping routes assing');
      }
    }
  }

  public async execute(passengerBoarding: PassengerBoarding) {
    await this.validateClientExists(passengerBoarding.getClientId);
    await this.validateRouteAssignExists(passengerBoarding.getRouteAssignId);
    await this.validateRouteAssignAvailable(passengerBoarding.getRouteAssignId);
    await this.validateWithLastPassengerBoarding(passengerBoarding);

    const assignRouteRecord = await this.assignRouteService.getById(passengerBoarding.getRouteAssignId);
    await this.decreaseBalanceService.execute(new BalanceChange(passengerBoarding.getClientId, assignRouteRecord.getPassengerPrice));
    return await this.passengerBoardingRepository.create(passengerBoarding);
  }

}
