import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainCommand {

  @IsString()
  @ApiProperty({ minLength: 4, maxLength: 7, example: '#F6F823' })
  public color: string;

  @IsNumber()
  @ApiProperty({ minimum: 1, example: 15 })
  public passengerLimit: number;

}
