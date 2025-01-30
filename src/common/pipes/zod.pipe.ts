import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      console.log('ZodValidationPipe - Incoming value:', value);
      const result = this.schema.parse(value);
      console.log('ZodValidationPipe - Validated result:', result);
      return result;
    } catch (error) {
      console.error('ZodValidationPipe - Validation error:', error.errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.errors,
        receivedValue: value,
      });
    }
  }
}
