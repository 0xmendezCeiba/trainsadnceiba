import { DomainError } from './domain.error';

export class NotFoundError extends DomainError {
  constructor(mensaje: string) {
    super(mensaje, NotFoundError.name);
  }
}
