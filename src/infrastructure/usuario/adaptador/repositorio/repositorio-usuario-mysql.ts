import { RepositorioUsuario } from 'src/domain/usuario/puerto/repositorio/repositorio-usuario';
import { Usuario } from 'src/domain/usuario/modelo/usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../../entidad/usuario.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositorioUsuarioMysql implements RepositorioUsuario {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly repositorio: Repository<UsuarioEntidad>,
  ) {}

  async existeNombreUsuario(nombre: string): Promise<boolean> {
    return (await this.repositorio.count({ nombre })) > 0;
  }

  async guardar(usuario: Usuario) {
    const entidad = new UsuarioEntidad();
    entidad.clave = usuario.clave;
    entidad.fechaCreacion = usuario.fechaCreacion;
    entidad.nombre = usuario.nombre;
    await this.repositorio.save(entidad);
  }
}
