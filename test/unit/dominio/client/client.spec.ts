import { Client } from 'src/domain/client/model/client';
import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

describe('Client', () => {

  it('The full name value is required', () => {
    return expect(async () => new Client('', '123', 20))
      .rejects
      .toStrictEqual(new InvalidValueError('The full name value must not be empty'));
  });

  it('The identity code value is required', () => {
    return expect(async () => new Client('User', '', 20))
      .rejects
      .toStrictEqual(new InvalidValueError('The identity code value must not be empty'));
  });
  
  it('The balance value must be positive', () => {
    return expect(async () => new Client('User', '1234', 0))
      .rejects
      .toStrictEqual(new InvalidValueError('The balance value must be greater than 0'));
  });

  it('Success to create client', () => {
    const client =  new Client('User', '1234', 10);

    expect(client.getBalance).toEqual(10);
    expect(client.getFullName).toEqual('User');
    expect(client.getIdentityCode).toEqual('1234');
  });

});
