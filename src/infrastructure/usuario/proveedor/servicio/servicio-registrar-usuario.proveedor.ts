import { RepositorioUsuario } from 'src/domain/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioRegistrarUsuario } from 'src/domain/usuario/servicio/servicio-registrar-usuario';

export function servicioRegistrarUsuarioProveedor(repositorioUsuario: RepositorioUsuario) {
  return new ServicioRegistrarUsuario(repositorioUsuario);
}
