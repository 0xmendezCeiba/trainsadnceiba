import { IsNumber, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRouteCommand {
  
  @IsNumber()
  @ApiProperty({ example: 10 })
  public trainId: number;

  @IsDateString()
  @ApiProperty({ example: '2021-07-20T08:10:24.857Z' })
  public startAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2021-07-20T11:41:24.787Z' })
  public endAt: Date;

  @IsNumber()
  @ApiProperty({ example: 30 })
  public passengerPrice: number;

  @IsString()
  @ApiProperty({ example: 'XDC45Q' })
  public roadCode: string;
  
}
