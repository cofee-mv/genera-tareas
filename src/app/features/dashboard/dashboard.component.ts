// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TareaService } from '../../core/services/tarea.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, Tarea } from '../../core/models/tarea.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  misTareas = signal<Tarea[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private tareaService: TareaService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    await Promise.all([this.loadStats(), this.loadMisTareas()]);
    this.loading.set(false);
  }

  private async loadStats() {
    const result = await this.tareaService.getDashboardStats();
    if (result.data) {
      this.stats.set(result.data);
    }
  }

  private async loadMisTareas() {
    const result = await this.tareaService.getMisTareas();
    this.misTareas.set(result.data.slice(0, 5));
  }

  getEstadoBadge(estado: string): string {
    return `badge badge-${estado}`;
  }

  getPrioridadBadge(prioridad: string): string {
    return `badge badge-${prioridad}`;
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      en_progreso: 'En Progreso',
      completada: 'Completada'
    };
    return labels[estado] || estado;
  }

  getCompletionPercentage(): number {
    const s = this.stats();
    if (!s || s.total_tareas === 0) return 0;
    return Math.round((s.tareas_completadas / s.total_tareas) * 100);
  }

  isVencida(fechaLimite?: string): boolean {
    if (!fechaLimite) return false;
    return new Date(fechaLimite) < new Date();
  }
}
