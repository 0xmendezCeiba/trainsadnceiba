import { Module } from '@nestjs/common';
import { UsuarioControlador } from './controlador/usuario.controlador';
import { UsuarioProveedorModule } from './proveedor/usuario-proveedor.module';

@Module({
  imports: [
    UsuarioProveedorModule
  ],
  controllers: [UsuarioControlador],
})
export class UsuarioModule {}
