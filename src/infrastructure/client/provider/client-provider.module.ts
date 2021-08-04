import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientEntity } from '../entity/client.entity';
import { CreateClientHandler } from 'src/application/client/command/create-client.handler';
import { IncreaseBalanceHandler } from 'src/application/client/command/increase-balance.handler';
import { createClientServiceProvider } from './service/create-client-service.provider';
import { increaseBalanceServiceProvider } from './service/increase-balance-service.provider';
import { decreaseBalanceServiceProvider } from './service/decrease-balance-service.provider';
import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { clientRepositoryProvider } from './repository/client-repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  providers: [
    clientRepositoryProvider,
    CreateClientHandler,
    IncreaseBalanceHandler,
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
    {
      provide: DecreaseBalanceService,
      inject: [ClientRepository],
      useFactory: decreaseBalanceServiceProvider,
    },
  ],
  exports: [
    CreateClientHandler,
    IncreaseBalanceHandler,
    CreateClientService,
    IncreaseBalanceService,
    DecreaseBalanceService,
    ClientRepository,
  ]
})
export class ClientProviderModule {}
