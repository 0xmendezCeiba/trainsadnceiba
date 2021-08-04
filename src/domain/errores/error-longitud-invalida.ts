import { ErrorDeNegocio } from './error-de-negocio';

export class ErrorLongitudInvalida extends ErrorDeNegocio {
  constructor(mensaje: string) {
    super(mensaje, ErrorLongitudInvalida.name);
  }
}
