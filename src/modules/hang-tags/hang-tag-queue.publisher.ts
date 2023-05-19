import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';
import { Options } from 'amqplib';
import { IDefaultResponse } from 'src/commom/types/DefaultResponse';
import { HangTag } from './entities/hang-tag.entity';

@Injectable()
export class HangTagQueuePublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishXlsxFileInQueue(
    file: Express.Multer.File,
  ): Promise<IDefaultResponse<HangTag>> {
    this.amqpConnection.publish(
      'spreadsheet_exchange',
      'processFile',
      file.buffer.toString('base64'),
      {
        persistent: true,
        durable: true,
      } as Options.Publish,
    );

    return {
      data: null,
      message: [
        'Arquivo está sendo processado, assim que finalizar você será notificado',
      ],
    };
  }
}
