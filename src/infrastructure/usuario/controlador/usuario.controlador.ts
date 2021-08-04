import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoRegistrarUsuario } from 'src/application/usuario/comando/registrar-usuario.comando';
import { ManejadorRegistrarUsuario } from 'src/application/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/application/usuario/consulta/listar-usuarios.manejador';
import { UsuarioDto } from 'src/application/usuario/consulta/dto/usuario.dto';

@Controller('usuarios')
export class UsuarioControlador {
  constructor(
    private readonly _manejadorRegistrarUsuario: ManejadorRegistrarUsuario,
    private readonly _manejadorListarUsuario: ManejadorListarUsuario,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRegistrarUsuario: ComandoRegistrarUsuario) {
    await this._manejadorRegistrarUsuario.ejecutar(comandoRegistrarUsuario);
  }

  @Get()
  async listar(): Promise<UsuarioDto[]> {
    return this._manejadorListarUsuario.ejecutar();
  }
}
