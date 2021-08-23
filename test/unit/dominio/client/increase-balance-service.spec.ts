import { IncreaseBalanceService } from 'src/domain/client/service/increase-balance.service';
import { BalanceChange } from 'src/domain/client/model/balance-change';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { Client } from 'src/domain/client/model/client';

describe('IncreaseBalanceService', () => {

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

  it('If client id exists, update client', async () => {
    const mount = 60;
    const identityCode = '10546231';
    const foundClient = new Client('Alejandro', identityCode, 15);
    const updatedClient = new Client(foundClient.getFullName, foundClient.getIdentityCode, foundClient.getBalance + mount);
    clientRepositoryStub.getById.returns(Promise.resolve(foundClient));
    clientRepositoryStub.update.returns(Promise.resolve(updatedClient));

    const response = await increaseBalanceService.execute(
      new BalanceChange(40, mount),
    );
    expect(response).toStrictEqual(updatedClient);
  });
  
});
