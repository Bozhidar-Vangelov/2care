import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, error: 'Business Error' }, statusCode);
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, id: string) {
    super(
      {
        message: `${entityName} with id ${id} not found`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super({ message, error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super({ message, error: 'Forbidden' }, HttpStatus.FORBIDDEN);
  }
}
