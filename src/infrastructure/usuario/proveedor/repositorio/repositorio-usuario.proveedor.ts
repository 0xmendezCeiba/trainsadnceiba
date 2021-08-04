import { RepositorioUsuario } from 'src/domain/usuario/puerto/repositorio/repositorio-usuario';
import { RepositorioUsuarioMysql } from 'src/infrastructure/usuario/adaptador/repositorio/repositorio-usuario-mysql';

export const repositorioUsuarioProvider = {
  provide: RepositorioUsuario,
  useClass: RepositorioUsuarioMysql,
};
