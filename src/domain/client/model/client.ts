import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

const MINIMUM_BALANCE = 0;

export class Client {

  private readonly fullName: string;
  private readonly identityCode: string;
  private readonly balance: number;

  constructor(fullName: string, identityCode: string, balance: number) {
    this.validateMinimumBalance(balance);
    this.validateNotEmptyIdentityCode(identityCode);
    this.validateNotEmptyFullName(fullName);
    this.fullName = fullName;
    this.identityCode = identityCode;
    this.balance = balance;
  }

  private validateMinimumBalance(balance: number) {
    const isValidBalance = balance > MINIMUM_BALANCE;
    if (!isValidBalance) {
      throw new InvalidValueError(`The balance value must be greater than ${MINIMUM_BALANCE}`);
    }
  }

  private validateNotEmptyIdentityCode(identityCode: string) {
    if (!identityCode.length) {
      throw new InvalidValueError(`The identity code value must not be empty`);
    }
  }

  private validateNotEmptyFullName(fullName: string) {
    if (!fullName.length) {
      throw new InvalidValueError(`The full name value must not be empty`);
    }
  }

  get getFullName(): string {
    return this.fullName;
  }

  get getIdentityCode(): string {
    return this.identityCode;
  }

  get getBalance(): number {
    return this.balance;
  }

}
