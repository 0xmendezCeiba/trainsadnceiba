import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncreaseBalanceCommand {

  @IsNumber()
  @ApiProperty({ example: 25 })
  clientId: number;

  @IsNumber()
  @ApiProperty({ minimum: 1, example: 50 })
  value: number;

}
