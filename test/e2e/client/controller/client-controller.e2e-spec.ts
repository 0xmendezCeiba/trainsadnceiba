import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from 'src/infrastructure/exceptions/domain-exceptions.filter';
import { InvalidValueExceptionsFilter } from 'src/infrastructure/exceptions/invalid-value-exceptions.filter';
import { NotFoundExceptionsFilter } from 'src/infrastructure/exceptions/not-found-exceptions.filter';
import { ClientController } from 'src/infrastructure/client/controller/client.controller';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { createClientServiceProvider } from 'src/infrastructure/client/provider/service/create-client-service.provider';
import { increaseBalanceServiceProvider } from 'src/infrastructure/client/provider/service/increase-balance-service.provider';
import { CreateClientHandler } from 'src/application/client/command/create-client.handler';
import { IncreaseBalanceHandler } from 'src/application/client/command/increase-balance.handler';
import { CreateClientCommand } from 'src/application/client/command/create-client.command';
import { IncreaseBalanceCommand } from 'src/application/client/command/increase-balance.command';
import { AppLogger } from 'src/infrastructure/configuration/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { Client } from 'src/domain/client/model/client';

const sinonSandbox = createSandbox();

describe('Clients controller test', () => {

  let app: INestApplication;
  let clientRepository: SinonStubbedInstance<ClientRepository>;

  beforeAll(async () => {
    clientRepository = createStubObj<ClientRepository>([
      'existsIdentityCode',
      'getById',
      'create',
      'update'
    ], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        AppLogger,
        {
          provide: CreateClientService,
          inject: [ClientRepository],
          useFactory: createClientServiceProvider,
        },
        {
          provide: IncreaseBalanceService,
          inject: [ClientRepository],
          useFactory: increaseBalanceServiceProvider,
        },
        { provide: ClientRepository, useValue: clientRepository },
        CreateClientHandler,
        IncreaseBalanceHandler,
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


  it('Must fail to create client, balance not positive', async () => {
      const client: CreateClientCommand = {
        fullName: 'Radamel Falcao',
        identityCode: '12345678',
        balance: 0,
      };
      const message = 'The balance value must be greater than 0';
    
      const response = await request(app.getHttpServer())
        .post('/clients').send(client)
        .expect(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe(message);
      expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create client, identityCode empty', async () => {
    const client: CreateClientCommand = {
      fullName: 'Radamel Falcao',
      identityCode: '',
      balance: 10,
    };
    const message = 'The identity code value must not be empty';
  
    const response = await request(app.getHttpServer())
      .post('/clients').send(client)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to create client, identityCode registred already', async () => {
    const client: CreateClientCommand = {
      fullName: 'Radamel Falcao',
      identityCode: '4561237',
      balance: 10,
    };
    clientRepository.existsIdentityCode.returns(Promise.resolve(true));
    const message = `The identity code ${client.identityCode} is already registered`;
  
    const response = await request(app.getHttpServer())
      .post('/clients').send(client)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
  

  it('Must fail to create client, fullName empty', async () => {
    const client: CreateClientCommand = {
      fullName: '',
      identityCode: '12345698',
      balance: 10,
    };
    const message = 'The full name value must not be empty';
    
  
    const response = await request(app.getHttpServer())
      .post('/clients').send(client)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to increase client balance, balance not positive', async () => {
    const increaseBalance: IncreaseBalanceCommand = {
      clientId: 6,
      value: -10,
    };
    const message = 'The value must be greater than 0';
  
    const response = await request(app.getHttpServer())
      .post('/clients/balance').send(increaseBalance)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(message);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });


  it('Must fail to increase client balance, client not found', async () => {
    const increaseBalance: IncreaseBalanceCommand = {
      clientId: 6,
      value: 10,
    };
    clientRepository.getById.returns(Promise.resolve(null));
    const message = 'Client not found';
  
    const response = await request(app.getHttpServer())
      .post('/clients/balance').send(increaseBalance)
      .expect(HttpStatus.NOT_FOUND);
    expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe(message);
  });


  it('Success to increase client balance', async () => {
    const increaseBalance: IncreaseBalanceCommand = {
      clientId: 6,
      value: 10,
    };
    clientRepository.getById.returns(Promise.resolve(
      new Client('User', '12345', 20)
    ));
    clientRepository.update.returns(Promise.resolve({
      fullName: 'User',
      balance: 30,
      identityCode: '12345',
      createdAt: '2021-08-03T14:13:22.200Z',
      id: 6
    }));

    const expectedData =  {
      fullName: 'User',
      balance: 30,
      identityCode: '12345',
      createdAt: '2021-08-03T14:13:22.200Z',
      id: 6
    };
  
    const response = await request(app.getHttpServer())
      .post('/clients/balance').send(increaseBalance)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });


  it('Success to create client', async () => {
    const client: CreateClientCommand = {
      fullName: 'Radamel Falcao',
      identityCode: '12345698',
      balance: 10,
    };
    clientRepository.existsIdentityCode.returns(Promise.resolve(false));
    clientRepository.create.returns(Promise.resolve({
      fullName: client.fullName,
      balance: client.balance,
      identityCode: client.identityCode,
      createdAt: '2021-08-03T14:13:22.200Z',
      id: 3
    }));

    const expectedData =  {
      fullName: client.fullName,
      balance: client.balance,
      identityCode: client.identityCode,
      createdAt: '2021-08-03T14:13:22.200Z',
      id: 3
    };
  
    const response = await request(app.getHttpServer())
      .post('/clients').send(client)
      .expect(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(expectedData);
  });

});
