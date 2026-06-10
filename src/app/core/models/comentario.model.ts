// src/app/core/models/comentario.model.ts
import { Usuario } from './usuario.model';

export interface Comentario {
  id: string;
  tarea_id: string;
  usuario_id: string;
  comentario: string;
  fecha_creacion: string;
  // Joined
  usuario?: Usuario;
}

export interface ComentarioForm {
  tarea_id: string;
  comentario: string;
}
