import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../../core/services/tarea.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Proyecto } from '../../../core/models/proyecto.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})
export class TareaFormComponent implements OnInit {
  formulario: FormGroup;
  cargando = false;
  error: string | null = null;
  exitoso = false;
  editando = false;

  proyectos: Proyecto[] = [];
  usuarios: Usuario[] = [];
  tareaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      proyecto_id: ['', Validators.required],
      usuario_asignado_id: [''],
      prioridad: ['media', Validators.required],
      estado: ['pendiente', Validators.required],
      fecha_limite: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.tareaId = this.route.snapshot.paramMap.get('id');

    if (this.tareaId) {
      this.editando = true;
      this.cargarTarea();
    }
  }

  async cargarDatos(): Promise<void> {
    const [proyRes, usuRes] = await Promise.all([
      this.proyectoService.getProyectos(),
      this.usuarioService.getUsuarios()
    ]);

    if (!proyRes.error) {
      this.proyectos = proyRes.data;
    }

    if (!usuRes.error) {
      this.usuarios = usuRes.data;
    }
  }

  async cargarTarea(): Promise<void> {
    if (!this.tareaId) return;

    this.cargando = true;
    const resultado = await this.tareaService.getTareaById(this.tareaId);

    if (resultado.error) {
      this.error = resultado.error;
    } else if (resultado.data) {
      this.formulario.patchValue({
        titulo: resultado.data.titulo,
        descripcion: resultado.data.descripcion,
        proyecto_id: resultado.data.proyecto_id,
        usuario_asignado_id: resultado.data.usuario_asignado_id,
        prioridad: resultado.data.prioridad,
        estado: resultado.data.estado,
        fecha_limite: resultado.data.fecha_limite
      });
    }

    this.cargando = false;
  }

  async guardar(): Promise<void> {
    if (this.formulario.invalid) {
      this.error = 'Por favor, complete los campos requeridos.';
      return;
    }

    this.cargando = true;
    this.error = null;
    this.exitoso = false;

    const datos = this.formulario.value;

    try {
      if (this.editando && this.tareaId) {
        const resultado = await this.tareaService.actualizarTarea(this.tareaId, datos);
        if (resultado.error) {
          this.error = resultado.error;
        } else {
          this.exitoso = true;
          setTimeout(() => this.router.navigate(['/tareas']), 1500);
        }
      } else {
        const resultado = await this.tareaService.crearTarea(datos);
        if (resultado.error) {
          this.error = resultado.error;
        } else {
          this.exitoso = true;
          setTimeout(() => this.router.navigate(['/tareas']), 1500);
        }
      }
    } finally {
      this.cargando = false;
    }
  }

  cancelar(): void {
    this.router.navigate(['/tareas']);
  }

  get titulo() {
    return this.formulario.get('titulo');
  }

  get proyecto_id() {
    return this.formulario.get('proyecto_id');
  }
}
