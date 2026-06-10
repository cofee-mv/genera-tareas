import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, RolUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;
  error: string | null = null;
  exitoso: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.cargando = true;
    this.error = null;
    const resultado = await this.usuarioService.getUsuarios();

    if (resultado.error) {
      this.error = resultado.error;
    } else {
      this.usuarios = resultado.data;
    }

    this.cargando = false;
  }

  async cambiarRol(usuario: Usuario, nuevoRol: RolUsuario): Promise<void> {
    this.exitoso = null;
    this.error = null;

    const resultado = await this.usuarioService.cambiarRol(usuario.id, nuevoRol);

    if (resultado.error) {
      this.error = resultado.error;
    } else {
      this.exitoso = `Rol de ${usuario.nombre} actualizado a ${nuevoRol}`;
      usuario.rol = nuevoRol;
    }
  }

  getClaseRol(rol: RolUsuario): string {
    return rol === 'admin' ? 'rol-admin' : 'rol-miembro';
  }
}
