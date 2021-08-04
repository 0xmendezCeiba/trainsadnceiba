import { Train } from 'src/domain/train/model/train';
import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

describe('Train', () => {

  it('Passenger limit must be positive', () => {
    return expect(async () => new Train(0, '#FEFEFE'))
      .rejects
      .toStrictEqual(new InvalidValueError('The passenger limit value must be an integer greater or equal to 1'));
  });

  it('Colors length must be 7', () => {
    return expect(async () => new Train(50, '#00000'))
      .rejects
      .toStrictEqual(new InvalidValueError('The color length must be 7'));
  });

  it('Success to create train', () => {
    const train = new Train(50, '#000000');

    expect(train.getPassengerLimit).toEqual(50);
    expect(train.getColor).toEqual('#000000');
  });

});
