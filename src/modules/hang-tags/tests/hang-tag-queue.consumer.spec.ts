import { Repository } from 'typeorm';
import { HangTagQueueConsumer } from '../hang-tag-queue.consumer';
import { HangTagsService } from '../hang-tags.service';
import { HangTag } from '../entities/hang-tag.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { HANG_TAGS_REPOSITORY } from '../providers/hang-tags.providers';

describe('HangTagQueueConsumer', () => {
  let hangTagQueueConsumer: HangTagQueueConsumer;
  let hangTagsService: HangTagsService;
  let hangTagsRepositoryMock: Repository<HangTag>;

  beforeEach(async () => {
    hangTagsRepositoryMock = {
      insert: jest.fn(),
    } as unknown as Repository<HangTag>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HangTagsService,
        HangTagQueueConsumer,
        { provide: HANG_TAGS_REPOSITORY, useValue: hangTagsRepositoryMock },
      ],
    }).compile();

    hangTagsService = module.get<HangTagsService>(HangTagsService);
    hangTagQueueConsumer =
      module.get<HangTagQueueConsumer>(HangTagQueueConsumer);
  });

  it('deve chamar o método createFromFile de HangTagsService com o buffer de arquivo fornecido', async () => {
    const fileBuffer = 'mocked file buffer';
    const createFromFileSpy = jest.spyOn(hangTagsService, 'createFromFile');

    await hangTagQueueConsumer.handleProcessFileFromQueue(fileBuffer);

    expect(createFromFileSpy).toHaveBeenCalledWith(fileBuffer);
  });

  it('deve registrar o erro se o método createFromFile gerar um erro', async () => {
    const fileBuffer = 'mocked file buffer';
    const error = new Error('Something went wrong');

    jest.spyOn(hangTagsService, 'createFromFile').mockRejectedValueOnce(error);

    const consoleLogSpy = jest.spyOn(console, 'log');

    await hangTagQueueConsumer.handleProcessFileFromQueue(fileBuffer);

    expect(consoleLogSpy).toHaveBeenCalledWith(error);
  });
});
