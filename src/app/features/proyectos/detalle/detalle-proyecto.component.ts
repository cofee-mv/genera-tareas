// src/app/features/proyectos/detalle/detalle-proyecto.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { TareaService } from '../../../core/services/tarea.service';
import { AuthService } from '../../../core/services/auth.service';
import { Proyecto } from '../../../core/models/proyecto.model';
import { Tarea } from '../../../core/models/tarea.model';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css']
})
export class DetalleProyectoComponent implements OnInit {
  proyecto = signal<Proyecto | null>(null);
  tareas = signal<Tarea[]>([]);
  filteredTareas = signal<Tarea[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  toast = signal<{ msg: string; type: 'success' | 'error' } | null>(null);
  confirmDeleteId = signal<string | null>(null);

  estadoFiltro = '';
  prioridadFiltro = '';
  searchTerm = '';

  proyectoId!: string;

  constructor(
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id')!;
    await Promise.all([this.loadProyecto(), this.loadTareas()]);
    this.loading.set(false);
  }

  async loadProyecto() {
    const result = await this.proyectoService.getProyectoById(this.proyectoId);
    if (result.data) this.proyecto.set(result.data);
    else this.error.set(result.error);
  }

  async loadTareas() {
    const result = await this.tareaService.getTareas({ proyecto_id: this.proyectoId });
    this.tareas.set(result.data);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.tareas();
    if (this.estadoFiltro) filtered = filtered.filter(t => t.estado === this.estadoFiltro);
    if (this.prioridadFiltro) filtered = filtered.filter(t => t.prioridad === this.prioridadFiltro);
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => t.titulo.toLowerCase().includes(term));
    }
    this.filteredTareas.set(filtered);
  }

  confirmDeleteTarea(id: string) { this.confirmDeleteId.set(id); }
  cancelDelete() { this.confirmDeleteId.set(null); }

  async deleteTarea(id: string) {
    const result = await this.tareaService.eliminarTarea(id);
    this.confirmDeleteId.set(null);
    if (result.error) {
      this.showToast(result.error, 'error');
    } else {
      this.showToast('Tarea eliminada.', 'success');
      await this.loadTareas();
    }
  }

  async cambiarEstado(tarea: Tarea, nuevoEstado: 'pendiente' | 'en_progreso' | 'completada') {
    const result = await this.tareaService.cambiarEstado(tarea.id, nuevoEstado);
    if (!result.error) await this.loadTareas();
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }

  canEdit(): boolean {
    const p = this.proyecto();
    return this.authService.isAdmin() || p?.usuario_creador_id === this.authService.getUsuarioId();
  }

  getTareasByEstado(estado: string): Tarea[] {
    return this.filteredTareas().filter(t => t.estado === estado);
  }

  getInitials(name?: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  }

  getPrioridadBadge(prioridad: string): string { return `badge badge-${prioridad}`; }
  getEstadoBadge(estado: string): string { return `badge badge-${estado}`; }
  getEstadoLabel(e: string): string {
    return { pendiente: 'Pendiente', en_progreso: 'En Progreso', completada: 'Completada' }[e] || e;
  }
}
