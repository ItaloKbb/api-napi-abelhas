import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: Record<string, unknown> = {
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      body =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, unknown>);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, body } = this.handlePrismaKnownError(exception));
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      body = { message: 'Invalid data provided' };
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      body = { message: 'Database service unavailable' };
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        { err: exception, statusCode: status, path: request.url },
        body.message as string,
      );
    } else {
      this.logger.warn(
        { statusCode: status, path: request.url },
        body.message as string,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...body,
    });
  }

  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): { status: number; body: Record<string, unknown> } {
    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        this.logger.debug({ meta: exception.meta }, 'P2002 meta');
        const raw =
          exception.meta?.target ??
          exception.meta?.constraint ??
          exception.meta?.field_name;
        const fields = Array.isArray(raw)
          ? raw.join(', ')
          : typeof raw === 'string'
            ? raw
            : 'desconhecido';
        const model = (exception.meta?.modelName as string) ?? '';
        const where = model ? ` em ${model}` : '';
        return {
          status: HttpStatus.CONFLICT,
          body: {
            message: `Já existe um registro${where} com o mesmo valor para: ${fields}`,
          },
        };
      }
      // Foreign key constraint failure
      case 'P2003': {
        const field = (exception.meta?.field_name as string) ?? 'unknown';
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: `Foreign key constraint failed on field: ${field}`,
          },
        };
      }
      // Record not found (update/delete on non-existent row)
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: (exception.meta?.cause as string) ?? 'Record not found',
          },
        };
      // Required relation violation
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          body: { message: 'Required relation violation' },
        };
      // Related record not found (connect)
      case 'P2018':
        return {
          status: HttpStatus.NOT_FOUND,
          body: { message: 'Related record not found' },
        };
      // Value too long for column
      case 'P2000': {
        const column = (exception.meta?.column_name as string) ?? 'unknown';
        return {
          status: HttpStatus.BAD_REQUEST,
          body: { message: `Value too long for column: ${column}` },
        };
      }
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: { message: 'Internal server error' },
        };
    }
  }
}
