import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TrainRepository } from "src/domain/train/port/repository/train.repository";
import { RouteAssignRepository } from "src/domain/train/port/repository/route-assign.repository";
import { PassengerBoardingRepository } from "src/domain/train/port/repository/passenger-boarding.repository";
import { trainRepositoryProvider } from './repository/train-repository.provider';
import { passengerBoardingRepositoryProvider } from './repository/passenger-boarding-repository.provider';
import { routeAssignRepositoryProvider } from './repository/assign-route-repository.provider';
import { CreateTrainHandler } from "src/application/train/command/create-train.handler";
import { AddPassengerHandler } from "src/application/train/command/add-passenger.handler";
import { AssignRouteHandler } from "src/application/train/command/assign-route.handler";
import { CreateTrainService } from "src/domain/train/service/create-train.service";
import { DecreaseBalanceService } from "src/domain/client/service/decrease-balance.service";
import { AssignRouteService } from "src/domain/train/service/assign-route.service";
import { AddPassengerService } from "src/domain/train/service/add-passenger.service";
import { ClientProviderModule } from "src/infrastructure/client/provider/client-provider.module";
import { CreateClientService } from "src/domain/client/service/create-client.service";
import { createTrainServiceProvider } from "./service/create-train-service.provider";
import { addPassengerServiceProvider } from "./service/add-passenger-service.provider";
import { assignRouteServiceProvider } from "./service/assign-route-service.provider";
import { TrainEntity } from '../entity/train.entity';
import { PassengerBoardingEntity } from '../entity/passenger-boarding.entity';
import { RouteAssignEntity } from '../entity/route-assign.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainEntity, RouteAssignEntity, PassengerBoardingEntity]),
    ClientProviderModule,
  ],
  providers: [
    trainRepositoryProvider,
    routeAssignRepositoryProvider,
    passengerBoardingRepositoryProvider,
    CreateTrainHandler,
    AssignRouteHandler,
    AddPassengerHandler,
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
      provide: AddPassengerService,
      inject: [AssignRouteService, CreateClientService, DecreaseBalanceService, PassengerBoardingRepository],
      useFactory: addPassengerServiceProvider,
    },
  ],
  exports: [
    CreateTrainHandler,
    AssignRouteHandler,
    AddPassengerHandler,
    CreateTrainService,
    AddPassengerService,
    TrainRepository,
    RouteAssignRepository,
  ],
})
export class TrainProviderModule {}
