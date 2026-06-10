// src/app/features/proyectos/lista/lista-proyectos.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Proyecto } from '../../../core/models/proyecto.model';

@Component({
  selector: 'app-lista-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.css']
})
export class ListaProyectosComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);
  filteredProyectos = signal<Proyecto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  toast = signal<{ msg: string; type: 'success' | 'error' } | null>(null);

  searchTerm = '';
  estadoFiltro = '';
  confirmDeleteId = signal<string | null>(null);

  constructor(
    private proyectoService: ProyectoService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadProyectos();
    this.loading.set(false);
  }

  async loadProyectos() {
    const result = await this.proyectoService.getProyectos();
    if (result.error) {
      this.error.set(result.error);
    } else {
      this.proyectos.set(result.data);
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = this.proyectos();
    if (this.estadoFiltro) {
      filtered = filtered.filter(p => p.estado === this.estadoFiltro);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion || '').toLowerCase().includes(term)
      );
    }
    this.filteredProyectos.set(filtered);
  }

  confirmDelete(id: string) {
    this.confirmDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmDeleteId.set(null);
  }

  async deleteProyecto(id: string) {
    const result = await this.proyectoService.eliminarProyecto(id);
    this.confirmDeleteId.set(null);
    if (result.error) {
      this.showToast(result.error, 'error');
    } else {
      this.showToast('Proyecto eliminado correctamente.', 'success');
      await this.loadProyectos();
    }
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }

  canEdit(proyecto: Proyecto): boolean {
    return this.authService.isAdmin() || proyecto.usuario_creador_id === this.authService.getUsuarioId();
  }

  getEstadoBadge(estado: string): string {
    return `badge badge-${estado}`;
  }

  getInitials(name?: string): string {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';
  }
}
