import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TareaService } from '../../../core/services/tarea.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { Tarea, TareaFiltros } from '../../../core/models/tarea.model';
import { Proyecto } from '../../../core/models/proyecto.model';

@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css']
})
export class ListaTareasComponent implements OnInit {
  tareas: Tarea[] = [];
  proyectos: Proyecto[] = [];
  cargando = true;
  error: string | null = null;
  filtroForm: FormGroup;

  filtros: TareaFiltros = {
    estado: '',
    prioridad: '',
    busqueda: '',
    proyecto_id: ''
  };

  constructor(
    private tareaService: TareaService,
    private proyectoService: ProyectoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      estado: [''],
      prioridad: [''],
      busqueda: [''],
      proyecto_id: ['']
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarTareas();

    this.filtroForm.valueChanges.subscribe(valores => {
      this.filtros = valores;
      this.cargarTareas();
    });
  }

  async cargarTareas(): Promise<void> {
    this.cargando = true;
    this.error = null;
    const resultado = await this.tareaService.getTareas(this.filtros);
    if (resultado.error) {
      this.error = resultado.error;
    } else {
      this.tareas = resultado.data;
    }
    this.cargando = false;
  }

  async cargarProyectos(): Promise<void> {
    const resultado = await this.proyectoService.getProyectos();
    if (!resultado.error) {
      this.proyectos = resultado.data;
    }
  }

  crearTarea(): void {
    this.router.navigate(['/tareas/nueva']);
  }

  editarTarea(tareaId: string): void {
    this.router.navigate(['/tareas', tareaId, 'editar']);
  }

  verDetalle(tareaId: string): void {
    this.router.navigate(['/tareas', tareaId]);
  }

  async eliminarTarea(tareaId: string): Promise<void> {
    if (confirm('¿Está seguro que desea eliminar esta tarea?')) {
      const resultado = await this.tareaService.eliminarTarea(tareaId);
      if (resultado.error) {
        this.error = resultado.error;
      } else {
        this.tareas = this.tareas.filter(t => t.id !== tareaId);
      }
    }
  }

  async cambiarEstado(tareaId: string, nuevoEstado: any): Promise<void> {
    const resultado = await this.tareaService.cambiarEstado(tareaId, nuevoEstado);
    if (!resultado.error) {
      await this.cargarTareas();
    }
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      estado: '',
      prioridad: '',
      busqueda: '',
      proyecto_id: ''
    });
  }

  getNombreProyecto(proyectoId: string): string {
    const proyecto = this.proyectos.find(p => p.id === proyectoId);
    return proyecto?.nombre || 'Sin proyecto';
  }

  getClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'en_progreso': 'estado-progreso',
      'completada': 'estado-completada'
    };
    return clases[estado] || '';
  }

  getClasePrioridad(prioridad: string): string {
    const clases: { [key: string]: string } = {
      'baja': 'prioridad-baja',
      'media': 'prioridad-media',
      'alta': 'prioridad-alta'
    };
    return clases[prioridad] || '';
  }
}
