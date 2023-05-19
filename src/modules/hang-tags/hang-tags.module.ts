import { Module } from '@nestjs/common';
import { HangTagsService } from './hang-tags.service';
import { HangTagsController } from './hang-tags.controller';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { DatabaseModule } from 'src/config/database.module';
import { HangTagQueueConsumer } from './hang-tag-queue.consumer';
import { HangTagQueuePublisher } from './hang-tag-queue.publisher';
import { hangTagsProviders } from './providers/hang-tags.providers';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'spreadsheet_exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
  ],
  controllers: [HangTagsController],
  providers: [
    ...hangTagsProviders,
    HangTagsService,
    HangTagQueueConsumer,
    HangTagQueuePublisher,
  ],
})
export class HangTagsModule {}
