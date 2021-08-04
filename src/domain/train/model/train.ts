import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

const MINIMUM_PASSENGER_LIMIT = 1;
const REQUIRED_COLOR_LENGTH = 7;

export class Train {

  private readonly passengerLimit: number;
  private readonly color: string;

  constructor(passengerLimit: number, color: string) {
    this.validateMinimumPassengerLimit(passengerLimit);
    this.validateRequiredColorLength(color);
    this.passengerLimit = passengerLimit;
    this.color = color;
  }

  private validateMinimumPassengerLimit(passsengerLimit: number) {
    const isValidPassengerLimit = Number.isInteger(passsengerLimit) && passsengerLimit >= MINIMUM_PASSENGER_LIMIT;
    if (!isValidPassengerLimit) {
      throw new InvalidValueError(`The passenger limit value must be an integer greater or equal to ${MINIMUM_PASSENGER_LIMIT}`);
    }
  }

  private validateRequiredColorLength(color: string) {
    if (color.length !== 7) {
      throw new InvalidValueError(`The color length must be ${REQUIRED_COLOR_LENGTH}`);
    }
  }

  get getPassengerLimit(): number {
    return this.passengerLimit;
  }

  get getColor(): string {
    return this.color;
  }

}
