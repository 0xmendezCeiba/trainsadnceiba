import { Module } from '@nestjs/common';

import { ClientController } from './controller/client.controller';
import { ClientProviderModule } from './provider/client-provider.module';

@Module({
  imports: [ClientProviderModule],
  controllers: [ClientController],
})
export class ClientModule {}
