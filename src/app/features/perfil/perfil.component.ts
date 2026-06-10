import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  formulario: FormGroup;
  cargando = false;
  editando = false;
  error: string | null = null;
  exitoso: string | null = null;

  constructor(
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    const usuarioActual = this.authService.usuario();
    if (usuarioActual) {
      this.usuario = usuarioActual;
      this.formulario.patchValue({
        nombre: usuarioActual.nombre,
        email: usuarioActual.email
      });
      this.formulario.disable();
    }
  }

  habilitarEdicion(): void {
    this.editando = true;
    this.formulario.enable();
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.formulario.disable();
    this.cargarPerfil();
    this.error = null;
    this.exitoso = null;
  }

  async guardarCambios(): Promise<void> {
    if (this.formulario.invalid || !this.usuario) return;

    this.cargando = true;
    this.error = null;
    this.exitoso = null;

    const resultado = await this.usuarioService.actualizarUsuario(this.usuario.id, {
      nombre: this.formulario.get('nombre')?.value,
      email: this.formulario.get('email')?.value
    });

    if (resultado.error) {
      this.error = resultado.error;
    } else {
      this.exitoso = 'Perfil actualizado exitosamente';
      this.editando = false;
      this.formulario.disable();
      await new Promise(r => setTimeout(r, 1500));
      this.cargarPerfil();
    }

    this.cargando = false;
  }

  get nombre() {
    return this.formulario.get('nombre');
  }

  get email() {
    return this.formulario.get('email');
  }
}
