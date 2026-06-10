-- ============================================================
-- SISTEMA DE GESTIÓN DE TAREAS COLABORATIVAS
-- Base de Datos: Supabase (PostgreSQL)
-- Prefijo de tablas: CBA
-- ============================================================

-- ============================================================
-- TIPOS ENUMERADOS
-- ============================================================
CREATE TYPE rol_usuario AS ENUM ('admin', 'miembro');
CREATE TYPE estado_tarea AS ENUM ('pendiente', 'en_progreso', 'completada');
CREATE TYPE prioridad_tarea AS ENUM ('baja', 'media', 'alta');
CREATE TYPE estado_proyecto AS ENUM ('activo', 'pausado', 'completado');

-- ============================================================
-- TABLA: CBA_Usuarios
-- Extiende auth.users de Supabase Auth
-- ============================================================
CREATE TABLE IF NOT EXISTS public."CBA_Usuarios" (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  rol         rol_usuario NOT NULL DEFAULT 'miembro',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public."CBA_Usuarios" ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para CBA_Usuarios
CREATE POLICY "Usuarios pueden ver todos los perfiles"
  ON public."CBA_Usuarios" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public."CBA_Usuarios" FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins pueden actualizar cualquier usuario"
  ON public."CBA_Usuarios" FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

CREATE POLICY "Sistema puede insertar usuarios"
  ON public."CBA_Usuarios" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- TABLA: CBA_Proyectos
-- ============================================================
CREATE TABLE IF NOT EXISTS public."CBA_Proyectos" (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              VARCHAR(150) NOT NULL,
  descripcion         TEXT,
  estado              estado_proyecto NOT NULL DEFAULT 'activo',
  fecha_inicio        DATE,
  fecha_fin           DATE,
  usuario_creador_id  UUID NOT NULL REFERENCES public."CBA_Usuarios"(id) ON DELETE SET NULL,
  fecha_creacion      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public."CBA_Proyectos" ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para CBA_Proyectos
CREATE POLICY "Usuarios autenticados pueden ver proyectos"
  ON public."CBA_Proyectos" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear proyectos"
  ON public."CBA_Proyectos" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_creador_id);

CREATE POLICY "Creador o admin puede editar proyectos"
  ON public."CBA_Proyectos" FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = usuario_creador_id
    OR EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

CREATE POLICY "Creador o admin puede eliminar proyectos"
  ON public."CBA_Proyectos" FOR DELETE
  TO authenticated
  USING (
    auth.uid() = usuario_creador_id
    OR EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- ============================================================
-- TABLA: CBA_Tareas
-- ============================================================
CREATE TABLE IF NOT EXISTS public."CBA_Tareas" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id           UUID NOT NULL REFERENCES public."CBA_Proyectos"(id) ON DELETE CASCADE,
  usuario_asignado_id   UUID REFERENCES public."CBA_Usuarios"(id) ON DELETE SET NULL,
  creado_por_id         UUID REFERENCES public."CBA_Usuarios"(id) ON DELETE SET NULL,
  titulo                VARCHAR(200) NOT NULL,
  descripcion           TEXT,
  prioridad             prioridad_tarea NOT NULL DEFAULT 'media',
  estado                estado_tarea NOT NULL DEFAULT 'pendiente',
  fecha_limite          DATE,
  fecha_creacion        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public."CBA_Tareas" ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para CBA_Tareas
CREATE POLICY "Usuarios autenticados pueden ver tareas"
  ON public."CBA_Tareas" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear tareas"
  ON public."CBA_Tareas" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creado_por_id);

CREATE POLICY "Creador, asignado o admin puede editar tareas"
  ON public."CBA_Tareas" FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = creado_por_id
    OR auth.uid() = usuario_asignado_id
    OR EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

CREATE POLICY "Creador o admin puede eliminar tareas"
  ON public."CBA_Tareas" FOR DELETE
  TO authenticated
  USING (
    auth.uid() = creado_por_id
    OR EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- ============================================================
-- TABLA: CBA_Comentarios
-- ============================================================
CREATE TABLE IF NOT EXISTS public."CBA_Comentarios" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id        UUID NOT NULL REFERENCES public."CBA_Tareas"(id) ON DELETE CASCADE,
  usuario_id      UUID NOT NULL REFERENCES public."CBA_Usuarios"(id) ON DELETE CASCADE,
  comentario      TEXT NOT NULL,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public."CBA_Comentarios" ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para CBA_Comentarios
CREATE POLICY "Usuarios autenticados pueden ver comentarios"
  ON public."CBA_Comentarios" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear comentarios"
  ON public."CBA_Comentarios" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Autor o admin puede eliminar comentarios"
  ON public."CBA_Comentarios" FOR DELETE
  TO authenticated
  USING (
    auth.uid() = usuario_id
    OR EXISTS (
      SELECT 1 FROM public."CBA_Usuarios" u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- ============================================================
-- FUNCIÓN: Trigger para sincronizar usuario tras registro
-- Se ejecuta automáticamente cuando un usuario se registra en Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."CBA_Usuarios" (id, nombre, email, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'rol')::rol_usuario, 'miembro')
  );
  RETURN NEW;
END;
$$;

-- Trigger automático en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_proyectos_updated_at
  BEFORE UPDATE ON public."CBA_Proyectos"
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER update_tareas_updated_at
  BEFORE UPDATE ON public."CBA_Tareas"
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- ============================================================
-- DATOS DE EJEMPLO (opcional, ejecutar manualmente)
-- ============================================================
-- Nota: Primero registra un usuario admin en Supabase Auth,
-- luego actualiza su rol manualmente:
-- UPDATE public."CBA_Usuarios" SET rol = 'admin' WHERE email = 'admin@example.com';

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================
CREATE INDEX idx_tareas_proyecto_id ON public."CBA_Tareas"(proyecto_id);
CREATE INDEX idx_tareas_usuario_asignado ON public."CBA_Tareas"(usuario_asignado_id);
CREATE INDEX idx_tareas_estado ON public."CBA_Tareas"(estado);
CREATE INDEX idx_tareas_prioridad ON public."CBA_Tareas"(prioridad);
CREATE INDEX idx_comentarios_tarea_id ON public."CBA_Comentarios"(tarea_id);
CREATE INDEX idx_proyectos_creador ON public."CBA_Proyectos"(usuario_creador_id);
