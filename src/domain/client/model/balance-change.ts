import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

const MINIMUM_VALUE = 0;

export class BalanceChange {

  private readonly clientId: number;
  private readonly value: number;

  constructor(clientId: number, value: number) {
    this.validateMinimumValue(value);
    this.clientId = clientId;
    this.value = value;
  }

  private validateMinimumValue(value: number) {
    const isValidValue = value > MINIMUM_VALUE;
    if (!isValidValue) {
      throw new InvalidValueError(`The value must be greater than ${MINIMUM_VALUE}`);
    }
  }

  get getClientId() {
    return this.clientId;
  }

  get getValue() {
    return this.value;
  }

}
