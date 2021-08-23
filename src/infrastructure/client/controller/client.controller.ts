import { Body, Post, UsePipes, ValidationPipe, Controller, Query, Get } from '@nestjs/common';

import { CreateClientCommand } from 'src/application/client/command/create-client.command';
import { CreateClientHandler } from 'src/application/client/command/create-client.handler';
import { IncreaseBalanceCommand } from 'src/application/client/command/increase-balance.command';
import { IncreaseBalanceHandler } from 'src/application/client/command/increase-balance.handler';
import { SearchClientHandler } from 'src/application/client/query/search-client.handler';

@Controller('clients')
export class ClientController {

  constructor(
    private readonly createClientHandler: CreateClientHandler,
    private readonly increaseBalanceHandler: IncreaseBalanceHandler,
    private readonly searchClientHandler: SearchClientHandler,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async create(@Body() createClientCommand: CreateClientCommand) {
    return this.createClientHandler.execute(createClientCommand);
  }

  @Get()
  public async getByIdentityCode(@Query('identityCode') identityCode: string = '') {
    return this.searchClientHandler.execute(identityCode);
  }

  @Post('/balance')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async increaseBalance(@Body() increaseBalanceCommand: IncreaseBalanceCommand) {
    return this.increaseBalanceHandler.execute(increaseBalanceCommand);
  }

}
