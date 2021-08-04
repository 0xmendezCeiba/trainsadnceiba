import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogger } from './configuration/ceiba-logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodeEnv } from './configuration/environment/env-node.enum';
import { databaseConfigFactory } from './configuration/database.config';
import { TrainModule } from './train/train.module';

@Module({
  providers: [AppLogger],
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfigFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION)
          .required(),
      }),
    }),
    ClientModule,
    TrainModule,
  ],
})
export class InfrastructureModule {
}
