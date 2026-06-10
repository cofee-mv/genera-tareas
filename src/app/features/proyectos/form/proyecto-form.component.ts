// src/app/features/proyectos/form/proyecto-form.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { ProyectoForm } from '../../../core/models/proyecto.model';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css']
})
export class ProyectoFormComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  loadingData = signal(false);
  error = signal<string | null>(null);
  isEditing = signal(false);
  proyectoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      descripcion: ['', Validators.maxLength(500)],
      estado: ['activo', Validators.required],
      fecha_inicio: [''],
      fecha_fin: ['']
    });
  }

  async ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id');
    if (this.proyectoId) {
      this.isEditing.set(true);
      await this.loadProyecto();
    }
  }

  private async loadProyecto() {
    this.loadingData.set(true);
    const result = await this.proyectoService.getProyectoById(this.proyectoId!);
    if (result.data) {
      this.form.patchValue({
        nombre: result.data.nombre,
        descripcion: result.data.descripcion || '',
        estado: result.data.estado,
        fecha_inicio: result.data.fecha_inicio || '',
        fecha_fin: result.data.fecha_fin || ''
      });
    } else {
      this.error.set(result.error);
    }
    this.loadingData.set(false);
  }

  get nombreCtrl() { return this.form.get('nombre')!; }
  get descripcionCtrl() { return this.form.get('descripcion')!; }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formData: ProyectoForm = {
      ...this.form.value,
      fecha_inicio: this.form.value.fecha_inicio || null,
      fecha_fin: this.form.value.fecha_fin || null,
      descripcion: this.form.value.descripcion || null
    };

    let result;
    if (this.isEditing()) {
      result = await this.proyectoService.actualizarProyecto(this.proyectoId!, formData);
    } else {
      result = await this.proyectoService.crearProyecto(formData);
    }

    if (result.error) {
      this.error.set(result.error);
      this.loading.set(false);
    } else {
      this.router.navigate(['/proyectos']);
    }
  }
}
