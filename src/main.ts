import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './commom/exceptions/bad.request.exception';
import { useContainer } from 'class-validator';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'spreadsheet_exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
  );

  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Uso da API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
