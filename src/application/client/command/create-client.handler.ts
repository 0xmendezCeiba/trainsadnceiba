import { Injectable } from '@nestjs/common';

import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { CreateClientCommand } from './create-client.command';
import { Client } from 'src/domain/client/model/client';

@Injectable()
export class CreateClientHandler {

  constructor(private createClientService: CreateClientService) {}
  
  public async execute(createClientCommand: CreateClientCommand) {
    const clientModel = new Client(
      createClientCommand.fullName,
      createClientCommand.identityCode,
      createClientCommand.balance,
    );
    return this.createClientService.execute(clientModel);
  }

}
