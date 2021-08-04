import { UsuarioDto } from 'src/application/usuario/consulta/dto/usuario.dto';

export abstract class DaoUsuario {
  abstract async listar(): Promise<UsuarioDto[]>;
}
