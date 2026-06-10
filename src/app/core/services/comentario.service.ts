// src/app/core/services/comentario.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Comentario, ComentarioForm } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async getComentariosByTarea(tareaId: string): Promise<{ data: Comentario[]; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Comentarios')
      .select(`
        *,
        usuario:CBA_Usuarios!usuario_id(id, nombre, email, avatar_url)
      `)
      .eq('tarea_id', tareaId)
      .order('fecha_creacion', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data as Comentario[], error: null };
  }

  async agregarComentario(form: ComentarioForm): Promise<{ data: Comentario | null; error: string | null }> {
    const userId = this.authService.getUsuarioId();
    if (!userId) return { data: null, error: 'No autenticado.' };

    const { data, error } = await this.supabaseService.client
      .from('CBA_Comentarios')
      .insert({
        tarea_id: form.tarea_id,
        usuario_id: userId,
        comentario: form.comentario
      })
      .select(`
        *,
        usuario:CBA_Usuarios!usuario_id(id, nombre, email, avatar_url)
      `)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Comentario, error: null };
  }

  async eliminarComentario(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Comentarios')
      .delete()
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }
}
