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
import { ClientDAO } from 'src/domain/client/port/dao/client.dao';
import { CreateClientHandler } from 'src/application/client/command/create-client.handler';
import { IncreaseBalanceHandler } from 'src/application/client/command/increase-balance.handler';
import { CreateClientCommand } from 'src/application/client/command/create-client.command';
import { AppLogger } from 'src/infrastructure/configuration/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { SearchClientHandler } from 'src/application/client/query/search-client.handler';


const sinonSandbox = createSandbox();

describe('Clients controller test', () => {

  let app: INestApplication;
  let clientRepository: SinonStubbedInstance<ClientRepository>;
  let clientDao: SinonStubbedInstance<ClientDAO>;

  beforeAll(async () => {
    clientRepository = createStubObj<ClientRepository>([
      'existsIdentityCode',
      'getById',
      'create',
      'update'
    ], sinonSandbox);
    clientDao = createStubObj<ClientDAO>([
      'searchByIdentityCode'
    ], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        AppLogger,
        { provide: ClientRepository, useValue: clientRepository },
        { provide: ClientDAO, useValue: clientDao },
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
        CreateClientHandler,
        IncreaseBalanceHandler,
        SearchClientHandler,
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
