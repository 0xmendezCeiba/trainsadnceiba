import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { Client } from 'src/domain/client/model/client';
import { BalanceChange } from 'src/domain/client/model/balance-change';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';

describe('CreateClientService', () => {

  let increaseBalanceService: IncreaseBalanceService;
  let clientRepositoryStub: SinonStubbedInstance<ClientRepository>;

  beforeEach(() => {
    clientRepositoryStub = createStubObj<ClientRepository>(['create', 'existsIdentityCode', 'update', 'getById']);
    increaseBalanceService = new IncreaseBalanceService(clientRepositoryStub);
  });

  it('If client id not exists, throw error', async () => {
    clientRepositoryStub.getById.returns(Promise.resolve(null));

    await expect(
      increaseBalanceService.execute(
        new BalanceChange(10, 60),
      ),
    ).rejects.toThrow('Client not found');
  });
  
});
