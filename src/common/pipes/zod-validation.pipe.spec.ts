import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  it('should pass validation for a valid object', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const pipe = new ZodValidationPipe(schema);

    const result = pipe.transform({ name: 'Alice', age: 30 }, {
      type: 'body',
    } as never);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should throw BadRequestException for an invalid object', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const pipe = new ZodValidationPipe(schema);

    expect(() =>
      pipe.transform({ name: 'Alice', age: 'not-a-number' }, {
        type: 'body',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('should include validation error details', () => {
    const schema = z.object({ email: z.string().email() });
    const pipe = new ZodValidationPipe(schema);

    let error: BadRequestException | undefined;
    try {
      pipe.transform({ email: 'invalid-email' }, { type: 'body' } as never);
    } catch (e) {
      error = e as BadRequestException;
    }

    expect(error).toBeInstanceOf(BadRequestException);
    const response = error!.getResponse() as {
      message: string;
      errors: { path: string; message: string }[];
    };
    expect(response.message).toBe('Validation failed');
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].path).toBe('email');
  });

  it('should strip unknown fields using Zod strict parsing', () => {
    const schema = z.object({ name: z.string() }).strict();
    const pipe = new ZodValidationPipe(schema);

    expect(() =>
      pipe.transform({ name: 'Alice', unknown: 'field' }, {
        type: 'body',
      } as never),
    ).toThrow(BadRequestException);
  });
});
