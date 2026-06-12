# 📋 Task Manager CBA - Sistema de Gestión de Tareas Colaborativas

Un sistema completo de gestión de proyectos y tareas colaborativas desarrollado con **Angular**, **Supabase** y **PostgreSQL**. Diseñado para ayudar a equipos de trabajo a organizar, asignar y hacer seguimiento de proyectos y tareas de manera eficiente.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Angular](https://img.shields.io/badge/Angular-19-red)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Descripción del Proyecto

Task Manager CBA es una aplicación web CRUD completa que implementa un sistema de gestión de tareas colaborativas. Los usuarios pueden crear proyectos, asignar tareas, establecer prioridades, fechas límite y hacer seguimiento del progreso en tiempo real.

### Características Principales

- ✅ **Autenticación segura** con Supabase Auth
- 📁 **Gestión de Proyectos** (CRUD completo)
- ✔️ **Gestión de Tareas** con prioridades y estados
- 👥 **Asignación de Tareas** a usuarios
- 💬 **Sistema de Comentarios** en tareas
- 📊 **Dashboard** con estadísticas y análisis
- 🔍 **Filtros avanzados** y búsqueda
- 👤 **Roles de usuario** (Admin y Miembro)
- 🔒 **Control de acceso** basado en roles (RBAC)
- 📱 **Interfaz responsiva** para dispositivos móviles

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 19** - Framework web moderno
- **TypeScript** - Lenguaje tipado
- **Angular Reactive Forms** - Validación de formularios
- **Angular Router** - Enrutamiento y guardias
- **CSS3** - Estilos modernos y responsivos

### Backend & Base de Datos
- **Supabase** - Platform as a Service (PaaS)
- **PostgreSQL** - Base de datos relacional
- **Supabase Auth** - Autenticación y autorización

---

## 📦 Requisitos Previos

- **Node.js** v18.x o superior
- **npm** v9.x o superior
- **Angular CLI** v19 o superior
- Una cuenta en **Supabase** (gratuita)
- Una cuenta en **GitHub**

---

## 🚀 Guía de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/task-manager-cba.git
cd task-manager-cba
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el script de `supabase/schema.sql`
3. En **Settings** → **API**, copia tu `Project URL` y `anon public key`

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
NG_APP_SUPABASE_URL=https://your-project.supabase.co
NG_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Ejecutar la Aplicación

```bash
npm start
```

Abre `http://localhost:4200/`

---

## 📋 Modelo de Base de Datos

### Tablas Principales (Prefijo: CBA_)

- **CBA_Usuarios** - Usuarios del sistema con roles
- **CBA_Proyectos** - Proyectos creados
- **CBA_Tareas** - Tareas dentro de proyectos
- **CBA_Comentarios** - Comentarios en tareas

Ver `supabase/schema.sql` para estructura completa.

---

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/
│   ├── guards/          # Guardias de rutas
│   ├── models/          # Interfaces TypeScript
│   └── services/        # Servicios
├── features/            # Componentes por módulo
│   ├── auth/
│   ├── dashboard/
│   ├── proyectos/
│   ├── tareas/
│   └── usuarios/
└── layout/              # Layout principal
```

---

## 📚 Rutas de la Aplicación

```
/auth/login              - Inicio de sesión
/auth/registro           - Registro
/dashboard               - Panel principal
/proyectos               - Listar proyectos
/proyectos/nuevo         - Crear proyecto
/proyectos/:id           - Detalle del proyecto
/tareas                  - Listar tareas
/tareas/nueva            - Crear tarea
/tareas/:id              - Detalle de tarea
/usuarios                - Gestión de usuarios (admin)
```


---

**Desarrollado por CBA - Formación Digital** ⭐
