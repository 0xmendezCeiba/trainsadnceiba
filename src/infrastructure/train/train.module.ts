import { Module } from "@nestjs/common";

import { TrainController } from './controller/train.controller';
import { TrainProviderModule } from "./provider/train-provider.module";

@Module({
  imports: [TrainProviderModule],
  controllers: [TrainController],
})
export class TrainModule {}
