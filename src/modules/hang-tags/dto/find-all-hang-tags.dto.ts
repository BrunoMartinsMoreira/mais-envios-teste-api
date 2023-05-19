import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindAllParams } from 'src/commom/types/FindAllParams';

export class FindAllHangTagsDto extends FindAllParams {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tag: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  source: string;
}
