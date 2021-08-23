import { DecreaseBalanceService } from 'src/domain/client/service/decrease-balance.service';
import { Client } from 'src/domain/client/model/client';
import { BalanceChange } from 'src/domain/client/model/balance-change';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';

describe('DecreaseBalanceService', () => {

  let decreaseBalanceService: DecreaseBalanceService;
  let clientRepositoryStub: SinonStubbedInstance<ClientRepository>;

  beforeEach(() => {
    clientRepositoryStub = createStubObj<ClientRepository>(['create', 'existsIdentityCode', 'update', 'getById']);
    decreaseBalanceService = new DecreaseBalanceService(clientRepositoryStub);
  });

  it('If client id not exists, throw error', async () => {
    clientRepositoryStub.getById.returns(Promise.resolve(null));

    await expect(
      decreaseBalanceService.execute(
        new BalanceChange(10, 60),
      ),
    ).rejects.toThrow('Client not found');
  });

  it('If client balance is insufficient, throw error', async () => {
    const client = new Client('Larry', '457391', 25)
    clientRepositoryStub.getById.returns(Promise.resolve(client));

    await expect(
      decreaseBalanceService.execute(
        new BalanceChange(10, 60),
      ),
    ).rejects.toThrow('Insufficient balance');
  });
  
});
