// src/app/core/models/tarea.model.ts
import { Usuario } from './usuario.model';
import { Proyecto } from './proyecto.model';

export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada';
export type PrioridadTarea = 'baja' | 'media' | 'alta';

export interface Tarea {
  id: string;
  proyecto_id: string;
  usuario_asignado_id?: string;
  creado_por_id: string;
  titulo: string;
  descripcion?: string;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  fecha_limite?: string;
  fecha_creacion: string;
  updated_at: string;
  // Joined
  asignado?: Usuario;
  creado_por?: Usuario;
  proyecto?: Proyecto;
}

export interface TareaForm {
  titulo: string;
  descripcion?: string;
  proyecto_id: string;
  usuario_asignado_id?: string;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  fecha_limite?: string;
}

export interface TareaFiltros {
  estado?: EstadoTarea | '';
  prioridad?: PrioridadTarea | '';
  busqueda?: string;
  proyecto_id?: string;
}

export interface DashboardStats {
  total_proyectos: number;
  total_tareas: number;
  tareas_pendientes: number;
  tareas_en_progreso: number;
  tareas_completadas: number;
  proyectos_activos: number;
}
