import { ApiProperty } from '@nestjs/swagger';

export class RouteAssignDTO {

  @ApiProperty({ example: 5 })
  routeAssignId: number;

  @ApiProperty({ example: 15 })
  trainId: number;

  @ApiProperty({ example: '#65656F' })
  color: string;

  @ApiProperty({ example: 'X25L' })
  roadCode: string;

  @ApiProperty({ example: 50 })
  passengerLimit: number;

  @ApiProperty({ example: 10 })
  passengerPrice: number;

  @ApiProperty({ example: '2021-07-20T08:10:24.857Z' })
  startAt: string;

  @ApiProperty({ example: '2021-07-20T11:41:24.787Z' })
  endAt: string;

}
