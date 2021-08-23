import { ApiProperty } from '@nestjs/swagger';

export class TrainDTO {

  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '#65656F' })
  color: string;

  @ApiProperty({ example: 50 })
  passengerLimit: number;

}
