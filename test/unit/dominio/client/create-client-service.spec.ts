import { CreateClientService } from 'src/domain/client/service/create-client.service';
import { Client } from 'src/domain/client/model/client';
import { ClientRepository } from 'src/domain/client/port/repository/client.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';


describe('CreateClientService', () => {

  let createClientService: CreateClientService;
  let clientRepositoryStub: SinonStubbedInstance<ClientRepository>;

  beforeEach(() => {
    clientRepositoryStub = createStubObj<ClientRepository>(['create', 'existsIdentityCode']);
    createClientService = new CreateClientService(clientRepositoryStub);
  });

  it('If identityCode exists, throw error', async () => {
    clientRepositoryStub.existsIdentityCode.returns(Promise.resolve(true));

    await expect(
      createClientService.execute(
        new Client('Test User', '1452368', 50),
      ),
    ).rejects.toThrow('The identity code 1452368 is already registered');
  });

  it('If identityCode not exists create client', async () => {
    const client = new Client('Alejandro Mendez', '1234778', 25);
    clientRepositoryStub.existsIdentityCode.returns(Promise.resolve(false));

    await createClientService.execute(client);

    expect(clientRepositoryStub.create.getCalls().length).toBe(1);
    expect(clientRepositoryStub.create.calledWith(client)).toBeTruthy();
  });
  
});
