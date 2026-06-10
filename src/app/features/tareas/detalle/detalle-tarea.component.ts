import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../../core/services/tarea.service';
import { ComentarioService } from '../../../core/services/comentario.service';
import { Tarea } from '../../../core/models/tarea.model';
import { Comentario } from '../../../core/models/comentario.model';

@Component({
  selector: 'app-detalle-tarea',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './detalle-tarea.component.html',
  styleUrls: ['./detalle-tarea.component.css']
})
export class DetalleTareaComponent implements OnInit {
  tarea: Tarea | null = null;
  comentarios: Comentario[] = [];
  cargando = true;
  error: string | null = null;

  formularioComentario: FormGroup;
  cargandoComentario = false;
  errorComentario: string | null = null;

  constructor(
    private tareaService: TareaService,
    private comentarioService: ComentarioService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formularioComentario = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarTarea();
  }

  async cargarTarea(): Promise<void> {
    const tareaId = this.route.snapshot.paramMap.get('id');
    if (!tareaId) return;

    this.cargando = true;
    const resultado = await this.tareaService.getTareaById(tareaId);

    if (resultado.error) {
      this.error = resultado.error;
    } else if (resultado.data) {
      this.tarea = resultado.data;
      await this.cargarComentarios(tareaId);
    }

    this.cargando = false;
  }

  async cargarComentarios(tareaId: string): Promise<void> {
    const resultado = await this.comentarioService.getComentariosByTarea(tareaId);
    if (!resultado.error) {
      this.comentarios = resultado.data;
    }
  }

  async agregarComentario(): Promise<void> {
    if (this.formularioComentario.invalid || !this.tarea) return;

    this.cargandoComentario = true;
    this.errorComentario = null;

    const resultado = await this.comentarioService.agregarComentario({
      tarea_id: this.tarea.id,
      comentario: this.formularioComentario.get('comentario')?.value
    });

    if (resultado.error) {
      this.errorComentario = resultado.error;
    } else if (resultado.data) {
      this.comentarios.push(resultado.data);
      this.formularioComentario.reset();
    }

    this.cargandoComentario = false;
  }

  editarTarea(): void {
    if (this.tarea) {
      this.router.navigate(['/tareas', this.tarea.id, 'editar']);
    }
  }

  async eliminarTarea(): Promise<void> {
    if (!this.tarea || !confirm('¿Está seguro que desea eliminar esta tarea?')) return;

    const resultado = await this.tareaService.eliminarTarea(this.tarea.id);
    if (resultado.error) {
      this.error = resultado.error;
    } else {
      this.router.navigate(['/tareas']);
    }
  }

  volver(): void {
    this.router.navigate(['/tareas']);
  }

  getClasePrioridad(prioridad: string): string {
    const clases: { [key: string]: string } = {
      'baja': 'prioridad-baja',
      'media': 'prioridad-media',
      'alta': 'prioridad-alta'
    };
    return clases[prioridad] || '';
  }

  getClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'en_progreso': 'estado-progreso',
      'completada': 'estado-completada'
    };
    return clases[estado] || '';
  }
}
