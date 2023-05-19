import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { HangTagsService } from './hang-tags.service';
import { CreateHangTagDto } from './dto/create-hang-tag.dto';
import { UpdateHangTagDto } from './dto/update-hang-tag.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { xlsxFileValidatorInterceptor } from 'src/commom/interceptors/xlsxFileValidator.interceptor';
import { defaultErrorHandler } from 'src/commom/utils/defaultErrorHandler';
import { HangTagQueuePublisher } from './hang-tag-queue.publisher';
import { FindAllHangTagsDto } from './dto/find-all-hang-tags.dto';
import { Like } from 'typeorm';

@Controller('hang-tags')
export class HangTagsController {
  constructor(
    private readonly hangTagsService: HangTagsService,
    private readonly hangTagQueuePublisher: HangTagQueuePublisher,
  ) {}

  @Post()
  async create(@Body() createHangTagDto: CreateHangTagDto) {
    try {
      return this.hangTagsService.create(createHangTagDto);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: xlsxFileValidatorInterceptor,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.hangTagQueuePublisher.publishXlsxFileInQueue(file);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllHangTagsDto) {
    try {
      const orderByParamns =
        query.orderDirection && query.orderName
          ? {
              orderByColumn: query.orderName,
              orderDirection: query.orderDirection,
            }
          : undefined;

      return this.hangTagsService.findAll({
        tableName: 'hangTags',
        page: query?.page,
        perPage: query?.perPage,
        order: orderByParamns,
        whereFilters: [
          query.tag ? { tag: Like(`%${query.tag}%`) } : undefined,
          query.name ? { name: Like(`%${query.name}%`) } : undefined,
          query.status ? { status: query.status } : undefined,
          query.source ? { source: Like(`%${query.source}%`) } : undefined,
        ],
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.hangTagsService.findOne({
        condition: { id: +id },
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHangTagDto: UpdateHangTagDto,
  ) {
    try {
      return this.hangTagsService.update({
        condition: { id: +id },
        body: updateHangTagDto,
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.hangTagsService.remove(+id);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }
}
