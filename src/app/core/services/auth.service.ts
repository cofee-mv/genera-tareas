// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { Usuario } from '../models/usuario.model';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session = signal<Session | null>(null);
  private _usuario = signal<Usuario | null>(null);
  private _loading = signal<boolean>(true);

  readonly session = this._session.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);
  readonly isAdmin = computed(() => this._usuario()?.rol === 'admin');

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    const { data } = await this.supabaseService.client.auth.getSession();
    this._session.set(data.session);

    if (data.session) {
      await this.loadUsuario(data.session.user.id);
    }

    this._loading.set(false);

    this.supabaseService.client.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        this._session.set(session);
        if (session) {
          await this.loadUsuario(session.user.id);
        } else {
          this._usuario.set(null);
        }
      }
    );
  }

  private async loadUsuario(userId: string): Promise<void> {
    const { data, error } = await this.supabaseService.client
      .from('CBA_Usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this._usuario.set(data as Usuario);
    }
  }

  async registrar(nombre: string, email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, rol: 'miembro' }
      }
    });

    if (error) return { error: error.message };
    return { error: null };
  }

  async iniciarSesion(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        return { error: 'Correo o contraseña incorrectos.' };
      }
      return { error: error.message };
    }

    this.router.navigate(['/dashboard']);
    return { error: null };
  }

  async cerrarSesion(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this._session.set(null);
    this._usuario.set(null);
    this.router.navigate(['/auth/login']);
  }

  getUsuarioId(): string | null {
    return this._session()?.user?.id ?? null;
  }
}
