import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from 'src/infrastructure/exceptions/domain-exceptions.filter';
import { InvalidValueExceptionsFilter } from 'src/infrastructure/exceptions/invalid-value-exceptions.filter';
import { NotFoundExceptionsFilter } from 'src/infrastructure/exceptions/not-found-exceptions.filter';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { TrainRepository } from 'src/domain/train/port/repository/train.repository';
import { RouteAssignRepository } from 'src/domain/train/port/repository/route-assign.repository';
import { PassengerBoardingRepository } from 'src/domain/train/port/repository/passenger-boarding.repository';
import { TrainController } from 'src/infrastructure/train/controller/train.controller';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { AddPassengerService } from 'src/domain/train/service/add-passenger.service';
import { AssignRouteService } from 'src/domain/train/service/assign-route.service';
import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { createClientServiceProvider } from 'src/infrastructure/client/provider/service/create-client-service.provider';
import { createTrainServiceProvider } from 'src/infrastructure/train/provider/service/create-train-service.provider';
import { assignRouteServiceProvider } from 'src/infrastructure/train/provider/service/assign-route-service.provider';
import { addPassengerServiceProvider } from 'src/infrastructure/train/provider/service/add-passenger-service.provider';
import { decreaseBalanceServiceProvider } from 'src/infrastructure/client/provider/service/decrease-balance-service.provider';
import { CreateTrainHandler } from 'src/application/train/command/create-train.handler';
import { CreateTrainCommand } from 'src/application/train/command/create-train.command';
import { AddPassengerHandler } from 'src/application/train/command/add-passenger.handler';
import { AddPassengerCommand } from 'src/application/train/command/add-passenger.command';
import { AssignRouteHandler } from 'src/application/train/command/assign-route.handler';
import { RouteAssign } from 'src/domain/train/model/route-assign';
import { AssignRouteCommand } from 'src/application/train/command/assign-route.command';
import { AppLogger } from 'src/infrastructure/configuration/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { Client } from 'src/domain/client/model/client';
import { Train } from 'src/domain/train/model/train';
import { ListTrainsHandler } from 'src/application/train/query/list-trains.handler';
import { ListRouteAssignHandler } from 'src/application/train/query/list-route-assign';
import { RouteAssignDAO } from 'src/domain/train/port/dao/route-assign.dao';
import { TrainDAO } from 'src/domain/train/port/dao/train.dao';

const sinonSandbox = createSandbox();

describe('Trains controller test', () => {

  let app: INestApplication;
  let trainRepository: SinonStubbedInstance<TrainRepository>;
  let routeAssignRepository: SinonStubbedInstance<RouteAssignRepository>;
  let passengerBoardingRepository: SinonStubbedInstance<PassengerBoardingRepository>;
  let clientRepository: SinonStubbedInstance<ClientRepository>;
  let routeAssignDao: SinonStubbedInstance<RouteAssignDAO>;
  let trainDao: SinonStubbedInstance<TrainDAO>;


  beforeAll(async () => {
    trainRepository = createStubObj<TrainRepository>([
      'getById',
      'create',
    ], sinonSandbox);
    routeAssignRepository = createStubObj<RouteAssignRepository>([
        'create',
        'getBetweenDates',
        'getById'
      ], sinonSandbox);
    clientRepository = createStubObj<ClientRepository>([
      'existsIdentityCode',
      'getById',
      'create',
      'update'
    ], sinonSandbox);
    passengerBoardingRepository = createStubObj<PassengerBoardingRepository>([
      'create',
      'getLastPassengerBoardingForClient'
    ], sinonSandbox);
    routeAssignDao = createStubObj<RouteAssignDAO>(['listAll'], sinonSandbox);
    trainDao = createStubObj<TrainDAO>(['listAll'], sinonSandbox);

    const moduleRef = await Test.createTestingModule({
      controllers: [TrainController],
      providers: [
        AppLogger,
        {
          provide: CreateClientService,
          inject: [ClientRepository],
          useFactory: createClientServiceProvider,
        },
        {
          provide: CreateTrainService,
          inject: [TrainRepository],
          useFactory: createTrainServiceProvider,
        },
        {
          provide: AssignRouteService,
          inject: [CreateTrainService, RouteAssignRepository],
          useFactory: assignRouteServiceProvider,
        },
        {
          provide: DecreaseBalanceService,
          inject: [ClientRepository],
          useFactory: decreaseBalanceServiceProvider,
        },
        {
          provide: AddPassengerService,
          inject: [AssignRouteService, CreateClientService, DecreaseBalanceService, PassengerBoardingRepository],
          useFactory: addPassengerServiceProvider,
        },
        { provide: TrainRepository, useValue: trainRepository },
        { provide: RouteAssignRepository, useValue: routeAssignRepository },
        { provide: PassengerBoardingRepository, useValue: passengerBoardingRepository },
        { provide: ClientRepository, useValue: clientRepository },
        { provide: TrainDAO, useValue: trainDao },
        { provide: RouteAssignDAO, useValue: routeAssignDao },
        AssignRouteHandler,
        AddPassengerHandler,
        CreateTrainHandler,
        ListTrainsHandler,
        ListRouteAssignHandler,
      ],
    }).compile();
  
    app = moduleRef.createNestApplication();
    const logger = await app.resolve(AppLogger);
    logger.customError = sinonSandbox.stub();
    app.useGlobalFilters(new DomainExceptionsFilter(logger));
    app.useGlobalFilters(new InvalidValueExceptionsFilter(logger));
    app.useGlobalFilters(new NotFoundExceptionsFilter(logger));
    await app.init();
  });
  
  afterEach(() => {
    sinonSandbox.restore();
  });
  
  afterAll(async () => {
    await app.close();
  });

  it('Success to create train', async () => {
    const train: CreateTrainCommand = {
      color: '#ffff00',
      passengerLimit: 10,
    };
    const expectedData = {
      color: train.color,
      passengerLimit: train.passengerLimit,
      createdAt: '2021-08-03T16:41:03.919Z',
      id: 6,
    };
    trainRepository.create.returns(Promise.resolve({
      color: train.color,
      passengerLimit: train.passengerLimit,
      createdAt: '2021-08-03T16:41:03.919Z',
      id: 6,
    }));
  
    const response = await request(app.getHttpServer())
      .post('/trains').send(train)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });

  it('Success to create route assign', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '12365',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    trainRepository.getById.returns(Promise.resolve(new Train(20, '#656565')));
    routeAssignRepository.getBetweenDates.returns(
      Promise.resolve([
        new RouteAssign(
          11,
          new Date('2021-08-20T10:10:24.857Z'),
          new Date('2021-08-20T12:15:24.857Z'),
          16,
          '1111112',
        ),
      ]),
    );

    routeAssignRepository.create.returns(Promise.resolve({
      id: 40,
      trainId: assignRoute.trainId,
      roadCode: assignRoute.roadCode,
      startAt: '2021-07-20T08:10:24.857Z',
      endAt: '2021-07-20T11:41:24.787Z',
      createdAt: '2021-07-07T07:41:24.787Z',
      passengerPrice: assignRoute.passengerPrice,
    }));
    const expectedData = {
      id: 40,
      trainId: assignRoute.trainId,
      roadCode: assignRoute.roadCode,
      startAt: '2021-07-20T08:10:24.857Z',
      endAt: '2021-07-20T11:41:24.787Z',
      createdAt: '2021-07-07T07:41:24.787Z',
      passengerPrice: assignRoute.passengerPrice,
    };
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });

  it('Success to create passenger boarding', async () => {
    const assignRoute: AddPassengerCommand = { clientId: 10, routeAssignId: 5 };
    const client = new Client('User', '123456', 100);
    clientRepository.getById.returns(Promise.resolve(client));

    const currentTime = new Date().getTime()
    const routeAssign = new RouteAssign(70, new Date(currentTime + 20000000), new Date(currentTime + 40000000), 15, '1447');
    routeAssignRepository.getById.returns(Promise.resolve(routeAssign));
    passengerBoardingRepository.getLastPassengerBoardingForClient.returns(Promise.resolve(null));

    clientRepository.update.returns(Promise.resolve({
      id: assignRoute.clientId,
      fullName: client.getFullName,
      balance: client.getBalance - routeAssign.getPassengerPrice,
      identityCode: client.getIdentityCode,
    }));
    passengerBoardingRepository.create.returns(Promise.resolve({
      id: 70,
      clientId: assignRoute.clientId,
      routeAssignId: assignRoute.routeAssignId,
      createdAt: '2021-07-07T07:41:24.787Z',
    }));
    const expectedData = {
      id: 70,
      clientId: assignRoute.clientId,
      routeAssignId: assignRoute.routeAssignId,
      createdAt: '2021-07-07T07:41:24.787Z',
    };
    
    const response = await request(app.getHttpServer())
      .post('/trains/passenger').send(assignRoute)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });

});
