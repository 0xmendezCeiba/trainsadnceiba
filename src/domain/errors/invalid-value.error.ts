import { DomainError } from './domain.error';

export class InvalidValueError extends DomainError {
  constructor(mensaje: string) {
    super(mensaje, InvalidValueError.name);
  }
}
