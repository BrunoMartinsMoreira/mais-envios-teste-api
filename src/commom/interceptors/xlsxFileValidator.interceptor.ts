import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const xlsxFileValidatorInterceptor = (req, file, cb) => {
  if (extname(file.originalname) === '.xlsx') {
    cb(null, true);
  } else {
    cb(
      new HttpException(
        'Somente arquivos .xlsx são aceitos',
        HttpStatus.FORBIDDEN,
      ),
      false,
    );
  }
};
