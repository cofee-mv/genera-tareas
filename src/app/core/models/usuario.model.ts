// src/app/core/models/usuario.model.ts

export type RolUsuario = 'admin' | 'miembro';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatar_url?: string;
  created_at: string;
}

export interface UsuarioForm {
  nombre: string;
  email: string;
  password?: string;
  rol?: RolUsuario;
}
