import { HttpException } from '@nestjs/common';
import { httpExceptionHandler } from '../httpExceptionHandler';

describe('httpExceptionHandler', () => {
  it('deve lançar HttpException com mensagem e status especificados', () => {
    const message = 'Internal Server Error';
    const httpStatus = 500;

    expect(() => httpExceptionHandler(message, httpStatus)).toThrow(
      HttpException,
    );
    expect(() => httpExceptionHandler(message, httpStatus)).toThrowError(
      new HttpException(
        {
          message: [message],
          data: null,
        },
        httpStatus,
      ),
    );
  });
});
