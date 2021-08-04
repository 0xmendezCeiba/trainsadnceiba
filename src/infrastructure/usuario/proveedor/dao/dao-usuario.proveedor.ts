import { DaoUsuario } from 'src/domain/usuario/puerto/dao/dao-usuario';
import { DaoUsuarioMysql } from 'src/infrastructure/usuario/adaptador/dao/dao-usuario-mysql';

export const daoUsuarioProvider = {
  provide: DaoUsuario,
  useClass: DaoUsuarioMysql,
};
