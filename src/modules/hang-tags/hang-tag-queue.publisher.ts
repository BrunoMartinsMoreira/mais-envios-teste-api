import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';
import { Options } from 'amqplib';

@Injectable()
export class HangTagQueuePublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishXlsxFileInQueue(file: Express.Multer.File) {
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
      message:
        'Arquivo está sendo processado, assim que finalizar você será notificado',
    };
  }
}
