import { Injectable } from '@nestjs/common';
import { HangTagsService } from './hang-tags.service';
import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';

@Injectable()
export class HangTagQueueConsumer {
  constructor(private readonly hangTagsService: HangTagsService) {}

  @RabbitSubscribe({
    exchange: 'spreadsheet_exchange',
    routingKey: 'processFile',
    queue: 'spreadsheet_queue',
  })
  async handleProcessFileFromQueue(fileBuffer: string): Promise<void> {
    try {
      await this.hangTagsService.createFromFile(fileBuffer);
    } catch (error) {
      console.log(error);
    }
  }
}
