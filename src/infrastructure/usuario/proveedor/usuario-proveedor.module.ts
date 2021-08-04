import { Module } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/domain/usuario/servicio/servicio-registrar-usuario';
import { RepositorioUsuario } from 'src/domain/usuario/puerto/repositorio/repositorio-usuario';
import { servicioRegistrarUsuarioProveedor } from './servicio/servicio-registrar-usuario.proveedor';
import { repositorioUsuarioProvider } from './repositorio/repositorio-usuario.proveedor';
import { daoUsuarioProvider } from './dao/dao-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/application/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/application/usuario/consulta/listar-usuarios.manejador';
import { DaoUsuario } from 'src/domain/usuario/puerto/dao/dao-usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../entidad/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad])],
  providers: [
    { provide: ServicioRegistrarUsuario, inject: [RepositorioUsuario], useFactory: servicioRegistrarUsuarioProveedor },
    repositorioUsuarioProvider,
    daoUsuarioProvider,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
  ],
  exports: [
    ServicioRegistrarUsuario,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    RepositorioUsuario,
    DaoUsuario,
  ],
})
export class UsuarioProveedorModule {

}
