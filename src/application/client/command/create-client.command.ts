import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientCommand {

  @IsString()
  @ApiProperty({ minLength: 4, maxLength: 20, example: '123456789' })
  public identityCode: string;

  @IsString()
  @ApiProperty({ example: 'Rigoberto Uran'})
  public fullName: string;

  @IsNumber()
  @ApiProperty({ minimum: 1, example: 10 })
  public balance: number;
  
}
