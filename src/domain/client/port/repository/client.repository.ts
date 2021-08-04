import { Client } from '../../model/client';

export abstract class ClientRepository {

  abstract existsIdentityCode(identityCode: string): Promise<Boolean>;
  abstract getById(id: number): Promise<Client | null>;
  abstract create(client: Client);
  abstract update(id: number, client: Client);

}
