export class DomainError extends Error {

  constructor(message: string, _class: string = DomainError.name) {
    super(message);
    this.name = _class;
  }

}
