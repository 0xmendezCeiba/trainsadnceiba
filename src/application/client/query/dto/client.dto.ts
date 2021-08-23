import { ApiProperty } from '@nestjs/swagger';

export class ClientDTO {

  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '15487595' })
  identityCode: string;

  @ApiProperty({ example: 'Rigoberto Uran' })
  fullName: string;

  @ApiProperty({ example: 50 })
  balance: number;

}
