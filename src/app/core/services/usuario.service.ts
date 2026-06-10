// src/app/core/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private supabaseService: SupabaseService) {}

  async getUsuarios(): Promise<{ data: Usuario[]; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Usuarios')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data as Usuario[], error: null };
  }

  async getUsuarioById(id: string): Promise<{ data: Usuario | null; error: string | null }> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Usuario, error: null };
  }

  async actualizarUsuario(id: string, updates: Partial<Usuario>): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client
      .from('CBA_Usuarios')
      .update(updates)
      .eq('id', id);

    if (error) return { error: error.message };
    return { error: null };
  }

  async cambiarRol(id: string, rol: 'admin' | 'miembro'): Promise<{ error: string | null }> {
    return this.actualizarUsuario(id, { rol });
  }
}
