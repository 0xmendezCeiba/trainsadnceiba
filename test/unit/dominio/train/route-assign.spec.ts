import { RouteAssign } from 'src/domain/train/model/route-assign';
import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

describe('Route assign', () => {

  it('Passenger limit must be positive', () => {
    const currentTime = new Date().getTime();
    return expect(async () => new RouteAssign(
        1,
        new Date(currentTime + 10000000),
        new Date(currentTime + 20000000),
        -15,
        '1985')
      )
      .rejects
      .toStrictEqual(new InvalidValueError('The passenger price value must be greater or equal to 0'));
  });


  it('The road code value is required', () => {
    const currentTime = new Date().getTime();
    return expect(async () => new RouteAssign(
        1,
        new Date(currentTime + 10000000),
        new Date(currentTime + 20000000),
        5,
        '')
      )
      .rejects
      .toStrictEqual(new InvalidValueError('The road code value is empty'));
  });


  it('The dates values are invalid', () => {
    const currentTime = new Date().getTime();
    return expect(async () => new RouteAssign(
        1,
        new Date(currentTime - 10000000),
        new Date(currentTime - 20000000),
        5,
        '1235')
      )
      .rejects
      .toStrictEqual(new InvalidValueError('The time interval is invalid'));
  });


  it('The route assign is not free', () => {
    const currentTime = new Date().getTime();
    const routeAssign = new RouteAssign(
      1,
      new Date(currentTime - 20000000),
      new Date(currentTime + 10000000),
      5,
      '1235');
    expect(routeAssign.isFreeBetween(
      new Date(currentTime),
      new Date(currentTime + 5000000),
    )).toStrictEqual(false);
  });

  it('The route assign is not free', () => {
    const currentTime = new Date().getTime();
    const routeAssign = new RouteAssign(
      1,
      new Date(currentTime - 20000000),
      new Date(currentTime + 10000000),
      5,
      '1235');
    expect(routeAssign.isFreeBetween(
      new Date(currentTime),
      new Date(currentTime + 50000000),
    )).toStrictEqual(false);
  });

  
  it('The route assign is not free', () => {
    const currentTime = new Date().getTime();
    const routeAssign = new RouteAssign(
      1,
      new Date(currentTime - 20000000),
      new Date(currentTime + 10000000),
      5,
      '1235');
    expect(routeAssign.isFreeBetween(
      new Date(currentTime - 50000000),
      new Date(currentTime),
    )).toStrictEqual(false);
  });


  it('The route assign is free', () => {
    const currentTime = new Date().getTime();
    const routeAssign = new RouteAssign(
      1,
      new Date(currentTime),
      new Date(currentTime + 10000000),
      5,
      '1235');
    expect(routeAssign.isFreeBetween(
      new Date(currentTime + 50000000),
      new Date(currentTime + 60000000),
    )).toStrictEqual(true);
  });


  it('Success to create route assign', () => {
    const currentTime = new Date().getTime();
    const startAt = new Date(currentTime + 10000000);
    const endAt = new Date(currentTime + 20000000);
    const routeAssign = new RouteAssign(1, startAt, endAt, 5, '1235');

    expect(routeAssign.getTrainId).toEqual(1);
    expect(routeAssign.getStartAt.getTime()).toEqual(startAt.getTime());
    expect(routeAssign.getEndAt.getTime()).toEqual(endAt.getTime());
    expect(routeAssign.getPassengerPrice).toEqual(5);
    expect(routeAssign.getRoadCode).toEqual('1235');
  });

});
