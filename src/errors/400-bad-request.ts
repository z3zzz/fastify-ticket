import { BaseError } from './base';

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}
