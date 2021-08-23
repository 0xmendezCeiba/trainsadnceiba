import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { AddPassengerService } from 'src/domain/train/service/add-passenger.service';
import { AssignRouteService } from 'src/domain/train/service/assign-route.service';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { PassengerBoardingRepository } from 'src/domain/train/port/repository/passenger-boarding.repository';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';

import { TrainRepository } from 'src/domain/train/port/repository/train.repository';
import { RouteAssignRepository } from 'src/domain/train/port/repository/route-assign.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { PassengerBoarding } from 'src/domain/train/model/passenger-boarding';
import { Client } from 'src/domain/client/model/client';
import { RouteAssign } from 'src/domain/train/model/route-assign';


describe('PassengerBoardingService', () => {

  let createTrainService: CreateTrainService;
  let createClientService: CreateClientService;
  let decreaseBalanceService: DecreaseBalanceService;
  let trainRepositoryStub: SinonStubbedInstance<TrainRepository>;
  let clientRepositoryStub: SinonStubbedInstance<ClientRepository>;
  let routeAssignRepositoryStub: SinonStubbedInstance<RouteAssignRepository>;
  let passengerBoardingRepositoryStub: SinonStubbedInstance<PassengerBoardingRepository>;
  let addPassengerService: AddPassengerService;
  let assignRouteService: AssignRouteService;

  beforeEach(() => {
    trainRepositoryStub = createStubObj<TrainRepository>(['create']);
    clientRepositoryStub = createStubObj<ClientRepository>(['create', 'existsIdentityCode', 'getById', 'update']);
    passengerBoardingRepositoryStub = createStubObj<PassengerBoardingRepository>(['create', 'getLastPassengerBoardingForClient']);
    routeAssignRepositoryStub = createStubObj<RouteAssignRepository>(['create', 'getBetweenDates', 'getById']);

    createTrainService = new CreateTrainService(trainRepositoryStub);
    createClientService = new CreateClientService(clientRepositoryStub);
    decreaseBalanceService = new DecreaseBalanceService(clientRepositoryStub);
    assignRouteService = new AssignRouteService(createTrainService, routeAssignRepositoryStub);
    addPassengerService = new AddPassengerService(assignRouteService, createClientService, decreaseBalanceService, passengerBoardingRepositoryStub);
  });

  it('If client not exists, throw error', async () => {
    clientRepositoryStub.getById.returns(Promise.resolve(null));
    await expect(
      addPassengerService.execute(new PassengerBoarding(15, 64))
    ).rejects.toThrow('Client not found')
  });

  it('If route assign not exists, throw error', async () => {
    const foundClient = new Client('Alejandro M', '54546', 25);
    clientRepositoryStub.getById.returns(Promise.resolve(foundClient));
    routeAssignRepositoryStub.getById.returns(Promise.resolve(null));
    
    await expect(
      addPassengerService.execute(new PassengerBoarding(15, 64))
    ).rejects.toThrow('Route assign not found')
  });

  it('If route assign not available, throw error', async () => {
    const currentTime = new Date().getTime();
    const foundClient = new Client('Alejandro M', '54546', 25);
    const foundRouteAssign = new RouteAssign(
      1,
      new Date(currentTime - 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
    );

    clientRepositoryStub.getById.returns(Promise.resolve(foundClient));
    routeAssignRepositoryStub.getById.returns(Promise.resolve(foundRouteAssign));
    
    await expect(
      addPassengerService.execute(new PassengerBoarding(15, 64))
    ).rejects.toThrow('Route assign not available')
  });

  
  it('If passenger boarding is already created, throw error', async () => {
    const currentTime = new Date().getTime();
    const foundClient = new Client('Alejandro M', '54546', 25);
    const foundPassengerBoarding = new PassengerBoarding(12, 12);
    const foundRouteAssign = new RouteAssign(
      1,
      new Date(currentTime + 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
    );

    clientRepositoryStub.getById.returns(Promise.resolve(foundClient));
    routeAssignRepositoryStub.getById.returns(Promise.resolve(foundRouteAssign));
    passengerBoardingRepositoryStub.getLastPassengerBoardingForClient.returns(Promise.resolve(foundPassengerBoarding))
    
    const sentData = new PassengerBoarding(foundPassengerBoarding.getRouteAssignId, foundPassengerBoarding.getClientId);
    await expect(
      addPassengerService.execute(sentData)
    ).rejects.toThrow('Duplicated passenger boarding')
  });

});
