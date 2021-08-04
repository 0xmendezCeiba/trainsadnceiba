import { Injectable } from '@nestjs/common';

import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { BalanceChange } from 'src/domain/client/model/balance-change';
import { IncreaseBalanceCommand } from './increase-balance.command';

@Injectable()
export class IncreaseBalanceHandler {

  constructor(private readonly increaseBalanceService: IncreaseBalanceService) {}

  public async execute(increaseBalanceCommand: IncreaseBalanceCommand) {
    const balanceIncrement = new BalanceChange(
      increaseBalanceCommand.clientId,
      increaseBalanceCommand.value
    );
    return this.increaseBalanceService.execute(balanceIncrement);
  }
}
