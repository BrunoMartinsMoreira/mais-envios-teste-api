import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { HangTagQueuePublisher } from '../hang-tag-queue.publisher';
import { Readable } from 'stream';

class AmqpConnectionMock {
  publish(
    exchange: string,
    routingKey: string,
    content: string,
    options?: any,
  ): void {
    console.log(exchange, routingKey, content, options);
  }
}

describe('HangTagQueuePublisher', () => {
  let hangTagQueuePublisher: HangTagQueuePublisher;
  let amqpConnection: AmqpConnectionMock;

  beforeEach(() => {
    amqpConnection = new AmqpConnectionMock();
    hangTagQueuePublisher = new HangTagQueuePublisher(
      amqpConnection as AmqpConnection,
    );
  });

  it('deve publicar o arquivo XLSX na fila com as opções corretas', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.xlsx',
      encoding: '7bit',
      mimetype: 'file/xlsx',
      size: 1024,
      buffer: Buffer.from('mock file content'),
      destination: '',
      filename: '',
      path: '',
      stream: new Readable(),
    };

    const publishSpy = jest.spyOn(amqpConnection, 'publish');

    await hangTagQueuePublisher.publishXlsxFileInQueue(file);

    expect(publishSpy).toHaveBeenCalledWith(
      'spreadsheet_exchange',
      'processFile',
      file.buffer.toString('base64'),
      {
        persistent: true,
        durable: true,
      },
    );
  });

  it('deve retornar o objeto de resposta padrão com a mensagem esperada', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.xlsx',
      encoding: '7bit',
      mimetype: 'file/xlsx',
      size: 1024,
      buffer: Buffer.from('mock file content'),
      destination: '',
      filename: '',
      path: '',
      stream: new Readable(),
    };

    const response = await hangTagQueuePublisher.publishXlsxFileInQueue(file);

    expect(response).toEqual({
      data: null,
      message: [
        'Arquivo está sendo processado, assim que finalizar você será notificado',
      ],
    });
  });
});
