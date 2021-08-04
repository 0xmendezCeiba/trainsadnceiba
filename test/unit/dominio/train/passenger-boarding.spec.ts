import { PassengerBoarding } from 'src/domain/train/model/passenger-boarding';

describe('Passenger boarding', () => {

  it('Success to create train', () => {
    const passengerBoarding = new PassengerBoarding(5, 15);

    expect(passengerBoarding.getRouteAssignId).toEqual(5);
    expect(passengerBoarding.getClientId).toEqual(15);
  });

});
