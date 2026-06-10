// src/app/core/models/proyecto.model.ts
import { Usuario } from './usuario.model';

export type EstadoProyecto = 'activo' | 'pausado' | 'completado';

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: EstadoProyecto;
  fecha_inicio?: string;
  fecha_fin?: string;
  usuario_creador_id: string;
  fecha_creacion: string;
  updated_at: string;
  // Joined
  creador?: Usuario;
  total_tareas?: number;
  tareas_completadas?: number;
}

export interface ProyectoForm {
  nombre: string;
  descripcion?: string;
  estado: EstadoProyecto;
  fecha_inicio?: string;
  fecha_fin?: string;
}
