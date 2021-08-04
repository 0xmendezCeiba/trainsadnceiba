import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoUsuario } from 'src/domain/usuario/puerto/dao/dao-usuario';
import { UsuarioDto } from 'src/application/usuario/consulta/dto/usuario.dto';

@Injectable()
export class DaoUsuarioMysql implements DaoUsuario {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async listar(): Promise<UsuarioDto[]> {
    return this.entityManager.query(
      'SELECT u.nombre, u."fechaCreacion" FROM USUARIO u',
    );
  }
}
