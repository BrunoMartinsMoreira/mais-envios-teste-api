import { PartialType } from '@nestjs/swagger';
import { CreateHangTagDto } from './create-hang-tag.dto';

export class UpdateHangTagDto extends PartialType(CreateHangTagDto) {}
