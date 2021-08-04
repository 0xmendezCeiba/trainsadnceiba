import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPassengerCommand {
  
  @IsNumber()
  @ApiProperty({ example: 10 })
  public routeAssignId: number;

  @IsNumber()
  @ApiProperty({ example: 10 })
  public clientId: number;

}
