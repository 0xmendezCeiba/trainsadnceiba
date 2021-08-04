import { AssignRouteService } from 'src/domain/train/service/assign-route.service';
import { AddPassengerService } from 'src/domain/train/service/add-passenger.service';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { PassengerBoardingRepository } from 'src/domain/train/port/repository/passenger-boarding.repository';

export function addPassengerServiceProvider(
  assignRouteService: AssignRouteService,
  createClientService: CreateClientService,
  decreaseBalanceService: DecreaseBalanceService,
  passengerBoardingRepository: PassengerBoardingRepository) {
  return new AddPassengerService(assignRouteService, createClientService, decreaseBalanceService, passengerBoardingRepository);
}
