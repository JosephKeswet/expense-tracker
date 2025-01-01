import { HttpStatus } from '@nestjs/common';
import { ResponseState } from 'src/shared/enum/response';

export type ISuccessResponse = {
  message: string;
  token?: string;
  data?: Record<string, any> | string | number;
  status?: HttpStatus;
  state?: ResponseState;
};

export type IErrorResponse = {
  status?: HttpStatus;
  message: string;
  error?: null;
  state?: ResponseState;
};
export type IResponse = ISuccessResponse | IErrorResponse;
