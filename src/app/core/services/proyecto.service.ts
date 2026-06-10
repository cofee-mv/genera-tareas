// src/app/core/services/proyecto.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Proyecto, ProyectoForm } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async getProyectos(): Promise<{ data: Proyecto[]; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Proyectos')
      .select(`
        *,
        creador:CBA_Usuarios!usuario_creador_id(id, nombre, email, rol),
        CBA_Tareas(count)
      `)
      .order('fecha_creacion', { ascending: false });

    if (error) return { data: [], error: error.message };

    const proyectos = (data || []).map((p: any) => ({
      ...p,
      total_tareas: p['CBA_Tareas']?.[0]?.count ?? 0
    }));

    return { data: proyectos as Proyecto[], error: null };
  }

  async getProyectoById(id: string): Promise<{ data: Proyecto | null; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Proyectos')
      .select(`
        *,
        creador:CBA_Usuarios!usuario_creador_id(id, nombre, email, rol, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Proyecto, error: null };
  }

  async crearProyecto(form: ProyectoForm): Promise<{ data: Proyecto | null; error: string | null }> {
    const userId = this.authService.getUsuarioId();
    if (!userId) return { data: null, error: 'Usuario no autenticado.' };

    const { data, error } = await this.supabaseService.client
      .from('CBA_Proyectos')
      .insert({
        ...form,
        usuario_creador_id: userId
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Proyecto, error: null };
  }

  async actualizarProyecto(id: string, form: Partial<ProyectoForm>): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Proyectos')
      .update(form)
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }

  async eliminarProyecto(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Proyectos')
      .delete()
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }
}
