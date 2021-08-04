import { BalanceChange } from 'src/domain/client/model/balance-change';
import { InvalidValueError } from 'src/domain/errors/invalid-value.error';

describe('Balance change', () => {

  it('The value must be positive', () => {
    return expect(async () => new BalanceChange(5, 0))
      .rejects
      .toStrictEqual(new InvalidValueError('The value must be greater than 0'));
  });

  it('Success to create balance change', () => {
    const balanceChange =  new BalanceChange(5, 5);

    expect(balanceChange.getClientId).toEqual(5);
    expect(balanceChange.getValue).toEqual(5);
  });

});
