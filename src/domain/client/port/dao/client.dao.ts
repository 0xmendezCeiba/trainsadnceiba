import { ClientDTO } from 'src/application/client/query/dto/client.dto';

export abstract class ClientDAO {
  abstract searchByIdentityCode(identityCode: string): Promise<ClientDTO | null>;
}
