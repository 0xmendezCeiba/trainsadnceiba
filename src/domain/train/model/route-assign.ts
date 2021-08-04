import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

const MINIMUM_PASSENGER_PRICE = 0;

export class RouteAssign {

  private readonly traintId: number;
  private readonly startAt: Date;
  private readonly endAt: Date;
  private readonly passengerPrice: number;
  private readonly roadCode: string;

  constructor(trainId: number, startAt: Date, endAt: Date, passengerPrice: number, roadCode: string) {
    this.validateMinimumPassengerPrice(passengerPrice);
    this.validateTimeInterval(startAt, endAt);
    this.validateNotEmptyRoadCode(roadCode);
    this.traintId = trainId;
    this.startAt = startAt;
    this.endAt = endAt;
    this.passengerPrice = passengerPrice;
    this.roadCode = roadCode;
  }

  private validateMinimumPassengerPrice(passsengerPrice: number) {
    const isValidPassengerPrice = passsengerPrice >= MINIMUM_PASSENGER_PRICE;
    if (!isValidPassengerPrice) throw new InvalidValueError(`The passenger price value must be greater or equal to ${MINIMUM_PASSENGER_PRICE}`);
  }

  private validateNotEmptyRoadCode(roadCode: string) {
    if (!roadCode.length) throw new InvalidValueError('The road code value is empty');
  }
  
  private validateTimeInterval(startAt: Date, endAt: Date) {
    const isValidTimeInterval = startAt.getTime() < endAt.getTime();
    if (!isValidTimeInterval) throw new InvalidValueError('The time interval is invalid');
  }

  get getTrainId() {
    return this.traintId;
  }

  get getStartAt() {
    return this.startAt;
  }

  get getEndAt() {
    return this.endAt;
  }

  get getPassengerPrice() {
    return this.passengerPrice;
  }

  get getRoadCode() {
    return this.roadCode;
  }

}
