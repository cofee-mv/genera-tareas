// src/app/core/services/tarea.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Tarea, TareaForm, TareaFiltros, DashboardStats } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async getTareas(filtros?: TareaFiltros): Promise<{ data: Tarea[]; error: string | null }> {
    let query = this.supabaseService.client
      .from('CBA_Tareas')
      .select(`
        *,
        asignado:CBA_Usuarios!usuario_asignado_id(id, nombre, email, avatar_url),
        creado_por:CBA_Usuarios!creado_por_id(id, nombre, email),
        proyecto:CBA_Proyectos!proyecto_id(id, nombre)
      `)
      .order('fecha_creacion', { ascending: false });

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado);
    }
    if (filtros?.prioridad) {
      query = query.eq('prioridad', filtros.prioridad);
    }
    if (filtros?.busqueda) {
      query = query.ilike('titulo', `%${filtros.busqueda}%`);
    }
    if (filtros?.proyecto_id) {
      query = query.eq('proyecto_id', filtros.proyecto_id);
    }

    const { data, error } = await query;
    if (error) return { data: [], error: error.message };
    return { data: data as Tarea[], error: null };
  }

  async getTareaById(id: string): Promise<{ data: Tarea | null; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Tareas')
      .select(`
        *,
        asignado:CBA_Usuarios!usuario_asignado_id(id, nombre, email, avatar_url),
        creado_por:CBA_Usuarios!creado_por_id(id, nombre, email),
        proyecto:CBA_Proyectos!proyecto_id(id, nombre, estado)
      `)
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Tarea, error: null };
  }

  async getMisTareas(): Promise<{ data: Tarea[]; error: string | null }> {
    const userId = this.authService.getUsuarioId();
    if (!userId) return { data: [], error: 'No autenticado.' };

    const { data, error } = await this.supabaseService.client
      .from('CBA_Tareas')
      .select(`
        *,
        proyecto:CBA_Proyectos!proyecto_id(id, nombre)
      `)
      .eq('usuario_asignado_id', userId)
      .order('fecha_limite', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data as Tarea[], error: null };
  }

  async crearTarea(form: TareaForm): Promise<{ data: Tarea | null; error: string | null }> {
    const userId = this.authService.getUsuarioId();
    if (!userId) return { data: null, error: 'Usuario no autenticado.' };

    const { data, error } = await this.supabaseService.client
      .from('CBA_Tareas')
      .insert({
        ...form,
        creado_por_id: userId,
        fecha_limite: form.fecha_limite || null
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Tarea, error: null };
  }

  async actualizarTarea(id: string, form: Partial<TareaForm>): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Tareas')
      .update(form)
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }

  async cambiarEstado(id: string, estado: 'pendiente' | 'en_progreso' | 'completada'): Promise<{ error: string | null }> {
    return this.actualizarTarea(id, { estado });
  }

  async eliminarTarea(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Tareas')
      .delete()
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }

  async getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
    const [proyectosRes, tareasRes] = await Promise.all([
      this.supabaseService.client.from('CBA_Proyectos').select('estado'),
      this.supabaseService.client.from('CBA_Tareas').select('estado')
    ]);

    if (proyectosRes.error || tareasRes.error) {
      return { data: null, error: 'Error al cargar estadísticas.' };
    }

    const proyectos = proyectosRes.data || [];
    const tareas = tareasRes.data || [];

    const stats: DashboardStats = {
      total_proyectos: proyectos.length,
      proyectos_activos: proyectos.filter((p: any) => p.estado === 'activo').length,
      total_tareas: tareas.length,
      tareas_pendientes: tareas.filter((t: any) => t.estado === 'pendiente').length,
      tareas_en_progreso: tareas.filter((t: any) => t.estado === 'en_progreso').length,
      tareas_completadas: tareas.filter((t: any) => t.estado === 'completada').length
    };

    return { data: stats, error: null };
  }
}
