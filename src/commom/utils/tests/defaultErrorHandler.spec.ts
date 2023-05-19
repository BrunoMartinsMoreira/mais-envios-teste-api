import { HttpException, HttpStatus } from '@nestjs/common';
import { defaultErrorHandler } from '../defaultErrorHandler';
import { DefaultMessages } from 'src/commom/types/DefaultMessages';

describe('defaultErrorHandler', () => {
  it('deve lançar exceção BadRequest com mensagem de resposta de erro', () => {
    const error = {
      status: 400,
      response: {
        message: 'Bad request',
        data: null,
      },
    };

    expect(() => defaultErrorHandler(error)).toThrow(HttpException);
    expect(() => defaultErrorHandler(error)).toThrowError(
      new HttpException(
        {
          message: 'Bad request',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('deve lançar exceção NotFound com default message', () => {
    const error = {
      response: {
        message: DefaultMessages.DATA_NOT_FOUND,
        data: null,
      },
    };

    expect(() => defaultErrorHandler(error)).toThrow(HttpException);
    expect(() => defaultErrorHandler(error)).toThrowError(
      new HttpException(
        {
          message: DefaultMessages.DATA_NOT_FOUND,
          data: null,
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('deve lançar exceção Forbidden com mensagem de resposta de erro', () => {
    const error = {
      status: 403,
      response: {
        message: 'Forbidden',
        data: null,
      },
    };

    expect(() => defaultErrorHandler(error)).toThrow(HttpException);
    expect(() => defaultErrorHandler(error)).toThrowError(
      new HttpException(
        {
          message: 'Forbidden',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      ),
    );
  });

  it('deve lançar exceção InternalServerError com default message', () => {
    const error = {};

    expect(() => defaultErrorHandler(error)).toThrow(HttpException);
    expect(() => defaultErrorHandler(error)).toThrowError(
      new HttpException(
        {
          message: DefaultMessages.INTERNAL_SERVER_ERROR,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
