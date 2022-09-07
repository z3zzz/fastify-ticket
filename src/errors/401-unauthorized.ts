import { BaseError } from './base';

export class UnAuthorizedError extends BaseError {
  statusCode = 401;

  constructor(message: string) {
    super(message);
  }
}
