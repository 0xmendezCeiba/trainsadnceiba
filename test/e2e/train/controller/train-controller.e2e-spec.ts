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
import { AppLogger } from 'src/infrastructure/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { Client } from 'src/domain/client/model/client';
import { Train } from 'src/domain/train/model/train';

const sinonSandbox = createSandbox();

describe('Trains controller test', () => {

  let app: INestApplication;
  let trainRepository: SinonStubbedInstance<TrainRepository>;
  let routeAssignRepository: SinonStubbedInstance<RouteAssignRepository>;
  let passengerBoardingRepository: SinonStubbedInstance<PassengerBoardingRepository>;
  let clientRepository: SinonStubbedInstance<ClientRepository>;


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
        AssignRouteHandler,
        AddPassengerHandler,
        CreateTrainHandler,
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


  it('Must fail to create train, passenger limit not positive', async () => {
    const train: CreateTrainCommand = {
      color: '#fffff',
      passengerLimit: 0,
    };
    const message = 'The passenger limit value must be an integer greater or equal to 1';
    
    const response = await request(app.getHttpServer())
      .post('/trains').send(train)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create train, color length not equal to 7', async () => {
    const train: CreateTrainCommand = {
      color: '#ffff',
      passengerLimit: 10,
    };
    const message = 'The color length must be 7';
  
    const response = await request(app.getHttpServer())
      .post('/trains').send(train)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Success to create train', async () => {
    const train: CreateTrainCommand = {
      color: '#ffff00',
      passengerLimit: 10,
    };
    const expectedData = {
      color: train.color,
      passengerLimit: train.passengerLimit,
      createdAt: "2021-08-03T16:41:03.919Z",
      id: 6,
    };
    trainRepository.create.returns(Promise.resolve({
      color: train.color,
      passengerLimit: train.passengerLimit,
      createdAt: "2021-08-03T16:41:03.919Z",
      id: 6,
    }));
  
    const response = await request(app.getHttpServer())
      .post('/trains').send(train)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });

  it('Must fail to create route assign, passenger price not positive', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '1235',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: -1,
    };
    const message = 'The passenger price value must be greater or equal to 0';
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create route assign, road code is empty', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    const message = 'The road code value is empty';
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create route assign, invalid interval time', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '12365',
      startAt: new Date('2021-09-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    const message = 'The time interval is invalid';
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create route assign, train not found', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '12365',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    trainRepository.getById.returns(Promise.resolve(null));
    const message = 'Train not found';
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
  });


  it('Must fail to create route assign, busy road', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '12365',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    trainRepository.getById.returns(Promise.resolve(
      new Train(20, '#656565'),
    ));
    routeAssignRepository.getBetweenDates.returns(
      Promise.resolve([
        new RouteAssign(
          6,
          new Date('2021-07-20T07:10:24.857Z'),
          new Date('2021-07-20T08:15:24.857Z'),
          56,
          assignRoute.roadCode,
        )
      ])
    );
    const message = `This time interval is busy for road ${assignRoute.roadCode}`;
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create route assign, busy train', async () => {
    const assignRoute: AssignRouteCommand = {
      trainId: 10,
      roadCode: '12365',
      startAt: new Date('2021-07-20T08:10:24.857Z'),
      endAt: new Date('2021-07-20T11:41:24.787Z'),
      passengerPrice: 10,
    };
    trainRepository.getById.returns(Promise.resolve(
      new Train(20, '#656565'),
    ));
    routeAssignRepository.getBetweenDates.returns(
      Promise.resolve([
        new RouteAssign(
          6,
          new Date('2021-07-20T07:10:24.857Z'),
          new Date('2021-07-20T08:15:24.857Z'),
          56,
          '11111',
        ),
        new RouteAssign(
          10,
          new Date('2021-07-20T10:10:24.857Z'),
          new Date('2021-07-20T12:15:24.857Z'),
          16,
          '1111112',
        ),
      ])
    );
    const message = 'Train busy for time interval';
    
    const response = await request(app.getHttpServer())
      .post('/trains/route').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
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


  it('Must fail to create passenger boarding, client not found', async () => {
    const assignRoute: AddPassengerCommand = { clientId: 10, routeAssignId: 5 };
    clientRepository.getById.returns(Promise.resolve(null));
    const message = 'Client not found';
    
    const response = await request(app.getHttpServer())
      .post('/trains/passenger').send(assignRoute)
      .expect(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
  });


  it('Must fail to create passenger boarding, route assign not found', async () => {
    const assignRoute: AddPassengerCommand = { clientId: 10, routeAssignId: 5 };
    clientRepository.getById.returns(Promise.resolve(new Client('User', '123456', 10)));
    routeAssignRepository.getById.returns(Promise.resolve(null))
    const message = 'Route assign not found';
    
    const response = await request(app.getHttpServer())
      .post('/trains/passenger').send(assignRoute)
      .expect(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
  });


  it('Must fail to create passenger boarding, route assign not available', async () => {
    const assignRoute: AddPassengerCommand = { clientId: 10, routeAssignId: 5 };
    clientRepository.getById.returns(Promise.resolve(new Client('User', '123456', 10)));
    const currentTime = new Date().getTime()
    routeAssignRepository.getById.returns(Promise.resolve(
      new RouteAssign(15, new Date(currentTime - 20000000), new Date(currentTime - 10000000), 15, '1447'),
    ));
    const message = 'Route assign not available';
    
    const response = await request(app.getHttpServer())
      .post('/trains/passenger').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create passenger boarding, insufficient balance', async () => {
    const assignRoute: AddPassengerCommand = { clientId: 10, routeAssignId: 5 };
    const client = new Client('User', '123456', 5);
    clientRepository.getById.returns(Promise.resolve(client));
    const currentTime = new Date().getTime()
    routeAssignRepository.getById.returns(Promise.resolve(
      new RouteAssign(70, new Date(currentTime + 20000000), new Date(currentTime + 40000000), 15, '1447'),
    ));
    passengerBoardingRepository.getLastPassengerBoardingForClient.returns(Promise.resolve(null));
    clientRepository.update.returns(Promise.resolve({
      id: assignRoute.clientId,
      fullName: client.getFullName,
      balance: client.getBalance,
      identityCode: client.getIdentityCode,
    }));
    const message = 'Insufficient balance';
    
    const response = await request(app.getHttpServer())
      .post('/trains/passenger').send(assignRoute)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
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
