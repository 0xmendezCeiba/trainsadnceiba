import { Body, Post, UsePipes, ValidationPipe, Controller } from '@nestjs/common';

import { CreateClientCommand } from 'src/application/client/command/create-client.command';
import { CreateClientHandler } from 'src/application/client/command/create-client.handler';
import { IncreaseBalanceCommand } from 'src/application/client/command/increase-balance.command';
import { IncreaseBalanceHandler } from 'src/application/client/command/increase-balance.handler';

@Controller('clients')
export class ClientController {

  constructor(
    private readonly createClientHandler: CreateClientHandler,
    private readonly increaseBalanceHandler: IncreaseBalanceHandler,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async create(@Body() createClientCommand: CreateClientCommand) {
    return await this.createClientHandler.execute(createClientCommand);
  }

  @Post('/balance')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async increaseBalance(@Body() increaseBalanceCommand: IncreaseBalanceCommand) {
    return await this.increaseBalanceHandler.execute(increaseBalanceCommand);
  }

}
