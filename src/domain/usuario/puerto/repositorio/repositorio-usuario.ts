import { Usuario } from '../../modelo/usuario';

export abstract class RepositorioUsuario {
  abstract async existeNombreUsuario(nombre: string): Promise<boolean>;
  abstract async guardar(usuario: Usuario);
}
