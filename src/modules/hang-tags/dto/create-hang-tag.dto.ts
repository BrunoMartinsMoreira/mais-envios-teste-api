import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHangTagDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  status: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNumber()
  price: number;
}
