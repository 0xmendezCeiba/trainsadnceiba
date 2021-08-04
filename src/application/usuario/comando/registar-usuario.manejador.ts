import { Injectable } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/domain/usuario/servicio/servicio-registrar-usuario';
import { ComandoRegistrarUsuario } from './registrar-usuario.comando';
import { Usuario } from 'src/domain/usuario/modelo/usuario';

@Injectable()
export class ManejadorRegistrarUsuario {
  constructor(private _servicioRegistrarUsuario: ServicioRegistrarUsuario) {}

  async ejecutar(comandoRegistrarUsuario: ComandoRegistrarUsuario) {
    await this._servicioRegistrarUsuario.ejecutar(
      new Usuario(
        comandoRegistrarUsuario.nombre,
        comandoRegistrarUsuario.clave,
        comandoRegistrarUsuario.fechaCreacion,
      ),
    );
  }
}
