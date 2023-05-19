import { HttpException } from '@nestjs/common';

export const httpExceptionHandler = (message: string, httpStatus: number) => {
  throw new HttpException(
    {
      message: [message],
      data: null,
    },
    httpStatus,
  );
};
