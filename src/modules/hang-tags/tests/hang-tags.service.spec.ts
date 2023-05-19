import { Test, TestingModule } from '@nestjs/testing';
import { HangTagsService } from '../hang-tags.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { HangTag } from '../entities/hang-tag.entity';
import { HANG_TAGS_REPOSITORY } from '../providers/hang-tags.providers';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DefaultMessages } from 'src/commom/types/DefaultMessages';
import * as xlsx from 'xlsx';

describe('HangTagsService', () => {
  let hangTagsService: HangTagsService;
  let queryBuilderMock: SelectQueryBuilder<HangTag>;
  let hangTagsRepositoryMock: Repository<HangTag>;

  const mockHangTag = {
    id: 1,
    name: 'test',
    tag: 'AF123456789BR',
    price: 1569.25,
    source: 'source test',
    status: 5,
    createdAt: new Date('2023-05-17T19:12:23.346Z'),
    updatedAt: new Date('2023-05-17T19:12:23.346Z'),
  };

  beforeEach(async () => {
    queryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    } as unknown as SelectQueryBuilder<HangTag>;

    hangTagsRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      insert: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilderMock),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    } as unknown as Repository<HangTag>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HangTagsService,
        { provide: HANG_TAGS_REPOSITORY, useValue: hangTagsRepositoryMock },
      ],
    }).compile();

    hangTagsService = module.get<HangTagsService>(HangTagsService);
  });

  describe('Instância das dependências', () => {
    it('Products Service', () => {
      expect(hangTagsService).toBeDefined();
    });
  });

  describe('Cadastro de etiqueta consumindo arquivo xlsx', () => {
    it('should parse the file buffer and insert the data into the repository', async () => {
      const fileBuffer = Buffer.from('base64-encoded-file-data');

      const readMock = jest.spyOn(xlsx, 'read');
      const insertMock = jest.spyOn(hangTagsRepositoryMock, 'insert');

      const worksheet = {
        '!ref': 'A1:E5',
        A1: { w: 'Tag' },
        B1: { w: 'Name' },
        C1: { w: 'Status' },
        D1: { w: 'Source' },
        E1: { w: 'Price' },
        A2: { w: 'tag1' },
        B2: { w: 'name1' },
        C2: { w: '1' },
        D2: { w: 'source1' },
        E2: { w: '10.5' },
      };

      readMock.mockReturnValue({
        Sheets: { Sheet1: worksheet },
        SheetNames: ['Sheet1'],
      });

      await hangTagsService.createFromFile(fileBuffer.toString('base64'));

      expect(xlsx.read).toHaveBeenCalledWith(fileBuffer, { type: 'buffer' });
      expect(insertMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('Cadastro de etiqueta', () => {
    it('Deve ser possível cadastrar uma etiqueta sem upload', async () => {
      jest.spyOn(hangTagsRepositoryMock, 'create').mockReturnValue(mockHangTag);

      const response = await hangTagsService.create({
        name: 'test',
        tag: 'AF123456789BR',
        price: 1569.25,
        source: 'source test',
        status: 5,
      });

      expect(hangTagsRepositoryMock.create).toHaveBeenLastCalledWith({
        name: 'test',
        tag: 'AF123456789BR',
        price: 1569.25,
        source: 'source test',
        status: 5,
      });
      expect(hangTagsRepositoryMock.save).toHaveBeenCalledWith(mockHangTag);
      expect(response.data).toEqual(mockHangTag);
    });
  });

  describe('Update de etiqueta', () => {
    it('repository.update deve ser chamado com os parametros corretos', async () => {
      jest
        .spyOn(hangTagsRepositoryMock, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      jest
        .spyOn(hangTagsRepositoryMock, 'findOne')
        .mockResolvedValue({ ...mockHangTag, price: 315.55 });

      await hangTagsService.update({
        condition: { id: 1 },
        body: {
          price: 315.55,
        },
      });

      expect(hangTagsRepositoryMock.update).toBeCalledTimes(1);
      expect(hangTagsRepositoryMock.update).toHaveBeenCalledWith(
        { id: 1 },
        { price: 315.55 },
      );
    });

    it('Deve atualizar uma etiqueta com os parametros corretos', async () => {
      jest
        .spyOn(hangTagsRepositoryMock, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      jest
        .spyOn(hangTagsRepositoryMock, 'findOne')
        .mockResolvedValue({ ...mockHangTag, price: 315.55 });

      const { data, message } = await hangTagsService.update({
        condition: { id: 1 },
        body: {
          price: 315.55,
        },
      });

      expect(data.price).toEqual(315.55);
      expect(message).toEqual(['Atualizado com sucesso.']);
    });

    it('Deve retornar um erro caso a condição seja inválida', async () => {
      jest
        .spyOn(hangTagsRepositoryMock, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 0 });

      await expect(
        hangTagsService.update({
          condition: { id: 111 },
          body: {
            price: 1569.25,
          },
        }),
      ).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('Busca de etiquetas', () => {
    it('Método findOne deve ser chamado com os argumentos corretos', async () => {
      jest
        .spyOn(hangTagsRepositoryMock, 'findOne')
        .mockResolvedValue(mockHangTag);

      await hangTagsService.findOne({
        condition: { id: 1 },
        relationsEntities: [],
      });

      expect(hangTagsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });

    it('Deve retornar uma etiqueta existente', async () => {
      const condition = { id: 1 };
      const relationsEntities = [];

      jest
        .spyOn(hangTagsRepositoryMock, 'findOne')
        .mockResolvedValue(mockHangTag);

      const result = await hangTagsService.findOne({
        condition,
        relationsEntities,
      });

      expect(result).toEqual({
        message: ['Consulta realizada com sucesso.'],
        data: mockHangTag,
      });
    });
    it('Deve retornar um erro caso a etiqueta não exista', async () => {
      const condition = { id: 1 };
      const relationsEntities = [];

      jest.spyOn(hangTagsRepositoryMock, 'findOne').mockResolvedValue(null);

      await expect(
        hangTagsService.findOne({ condition, relationsEntities }),
      ).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('Deve retornar etiquetas paginados no findAll', async () => {
      const params = {
        tableName: 'hangTags',
        whereFilters: [{ name: 'Nome teste' }],
        order: {
          orderByColumn: 'name',
          orderDirection: 'ASC' as const,
        },
        relationsEntities: [],
        perPage: 10,
        page: 1,
      };

      const result = await hangTagsService.findAll(params);

      expect(hangTagsRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'hangTags',
      );

      expect(
        hangTagsRepositoryMock.createQueryBuilder().select,
      ).toHaveBeenCalled();

      expect(
        hangTagsRepositoryMock.createQueryBuilder().where,
      ).toHaveBeenCalledWith({
        name: 'Nome teste',
      });

      expect(
        hangTagsRepositoryMock.createQueryBuilder().orderBy,
      ).toHaveBeenCalledWith('hangTags.name', 'ASC', 'NULLS LAST');

      expect(
        hangTagsRepositoryMock.createQueryBuilder().take,
      ).toHaveBeenCalledWith(10);

      expect(
        hangTagsRepositoryMock.createQueryBuilder().getManyAndCount,
      ).toHaveBeenCalled();

      expect(
        hangTagsRepositoryMock.createQueryBuilder().skip,
      ).toHaveBeenCalledWith(0);

      expect(result).toEqual({
        total: 0,
        lastPage: 0,
        page: 1,
        perPage: 10,
        data: [],
        message: ['Consulta realizada com sucesso.'],
      });
    });
  });

  describe('Deletar uma etiqueta', () => {
    it('repository.delete deve ser chamado com as condições corretas', async () => {
      const condition = { id: 1 };

      const deleteResult = { affected: 1, raw: [] };

      jest
        .spyOn(hangTagsRepositoryMock, 'delete')
        .mockResolvedValue(deleteResult);

      await hangTagsService.remove(condition);

      expect(hangTagsRepositoryMock.delete).toHaveBeenCalledWith(condition);
    });

    it('Deve retornar uma mensagem de sucesso quando um dado for deletado com sucesso', async () => {
      const condition = { id: 1 };
      const deleteResult = { affected: 1, raw: [] };

      jest
        .spyOn(hangTagsRepositoryMock, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await hangTagsService.remove(condition);

      expect(result).toEqual({
        message: ['Deletado com sucesso.'],
        data: null,
      });
    });

    it('Deve retornar um erro quando nenhum dado é encontrado', async () => {
      const condition = { id: 11 };
      const deleteResult = { affected: 0, raw: [] };

      jest
        .spyOn(hangTagsRepositoryMock, 'delete')
        .mockResolvedValue(deleteResult);

      await expect(hangTagsService.remove(condition)).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
