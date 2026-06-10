# 🔧 Guía de Configuración Local

## Instalación Paso a Paso

### 1. Requisitos Previos

Verifica que tengas instalado:

```bash
# Verificar Node.js
node --version    # Debe ser v18.x o superior

# Verificar npm
npm --version     # Debe ser v9.x o superior
```

Si no tienes Node.js, descárgalo desde [nodejs.org](https://nodejs.org)

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/task-manager-cba.git
cd task-manager-cba
```

### 3. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias, incluyendo Angular y Supabase.

### 4. Crear Proyecto Supabase

#### Opción A: Crear Nuevo Proyecto (Recomendado)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita si no tienes
3. Haz clic en "New Project"
4. Completa la información:
   - **Name**: task-manager
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la más cercana (ej: eu-west-1 para Europa)
5. Espera a que se cree (1-2 minutos)

#### Opción B: Usar Proyecto Existente

Si ya tienes un proyecto Supabase, simplemente obtén sus credenciales.

### 5. Ejecutar Script SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en "New Query"
3. Abre el archivo `supabase/schema.sql` en tu editor de código
4. Copia todo el contenido
5. Pega en el editor de SQL de Supabase
6. Haz clic en "Run"
7. Espera a que ejecute (debería ver "Success")

**Qué hace este script:**
- Crea las 4 tablas principales (CBA_*)
- Configura relaciones entre tablas
- Crea índices para optimizar consultas
- Configura Row Level Security (RLS)
- Crea triggers automáticos

### 6. Obtener Credenciales de Supabase

1. En Supabase, ve a **Settings** (esquina inferior izquierda)
2. Haz clic en **API**
3. Copia lo siguiente:
   - **Project URL** → necesitarás esto para `SUPABASE_URL`
   - **anon public** → necesitarás esto para `SUPABASE_ANON_KEY`

### 7. Crear Archivo .env.local

En la raíz del proyecto, crea un archivo llamado `.env.local`:

```bash
# En la carpeta raíz del proyecto
touch .env.local
```

Abre el archivo en tu editor y agrega:

```env
NG_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
NG_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Reemplaza:**
- `tu-proyecto` con el nombre real de tu proyecto
- La clave con la que obtuviste de Supabase

### 8. Iniciar el Servidor de Desarrollo

```bash
npm start
```

El servidor iniciará en `http://localhost:4200/`

### 9. Probar la Aplicación

1. Abre [http://localhost:4200](http://localhost:4200) en tu navegador
2. Deberías ver la página de login
3. Haz clic en "Registro" para crear una cuenta de prueba
4. Completa el formulario y crea una cuenta
5. Inicia sesión
6. Verás el dashboard

## Configuración Adicional (Opcional)

### Hacer Admin un Usuario

Si quieres que un usuario tenga permisos de admin:

1. En Supabase, ve a **Table Editor**
2. Abre la tabla `CBA_Usuarios`
3. Encuentra el usuario que deseas hacer admin
4. En la columna `rol`, cambia el valor a `admin`
5. Guarda los cambios

El usuario tendrá acceso a la sección de administración en el próximo login.

### Cambiar el Nombre del Proyecto

Para cambiar el nombre de la aplicación (que aparece en el navegador):

1. Abre `src/index.html`
2. Cambia el contenido de `<title>`
3. Guarda y recarga el navegador

### Personalizar Colores

Los colores están en `src/styles.css`. Puedes modificarlos para tu marca.

## Debugging

### Ver Logs en la Consola

En el navegador, abre **F12** (Developer Tools) para ver:
- Errores de JavaScript
- Peticiones a Supabase
- Mensajes de la aplicación

### Ver Datos en Supabase

Para verificar que los datos se guardan correctamente:

1. Ve a Supabase → **Table Editor**
2. Selecciona cada tabla para ver los registros
3. Puedes editar o eliminar directamente

### Habilitar Realtime (Opcional)

Para actualizaciones en tiempo real:

1. En Supabase, ve a **Replication**
2. Habilita para cada tabla que quieras actualizar en tiempo real
3. En el código Angular, puedes usar `supabaseService.client.from('tabla').on(...)`

## Estructura de Carpetas

```
task-manager-cba/
├── src/
│   ├── app/                    # Aplicación Angular
│   │   ├── core/               # Servicios y modelos
│   │   ├── features/           # Componentes
│   │   ├── layout/             # Layout principal
│   │   ├── app.routes.ts       # Rutas
│   │   └── app.config.ts       # Configuración
│   ├── environments/           # Configuración por ambiente
│   ├── styles.css              # Estilos globales
│   └── main.ts                 # Punto de entrada
├── supabase/
│   └── schema.sql              # Script de BD
├── .env.example                # Ejemplo de variables
├── angular.json                # Config de Angular CLI
├── package.json                # Dependencias
└── README.md                   # Este archivo
```

## Próximos Pasos

1. ✅ Instalación completada
2. 📝 Crea tu primer proyecto
3. ✔️ Crea algunas tareas
4. 🚀 Despliega en Vercel (ver `DEPLOYMENT.md`)

## Problemas Comunes

### "Cannot find module '@supabase/supabase-js'"

**Solución:**
```bash
npm install
```

### "Environment variables not found"

**Solución:**
- Verifica que el archivo se llama exactamente `.env.local`
- Verifica que está en la raíz del proyecto
- Reinicia el servidor (`npm start`)

### "Error de conexión a Supabase"

**Solución:**
- Verifica las credenciales en `.env.local`
- Verifica que el proyecto Supabase está activo
- Comprueba la conexión a internet

### "RLS policy violation"

**Solución:**
- Ejecuta nuevamente el script SQL completo
- Verifica que las políticas RLS estén creadas
- Comprueba el usuario autenticado

## Desinstalar y Limpiar

Si necesitas empezar de cero:

```bash
# Limpiar node_modules
rm -rf node_modules

# Limpiar cache
npm cache clean --force

# Reinstalar
npm install
```

---

¿Necesitas ayuda? Abre un issue en GitHub o consulta la documentación oficial de [Angular](https://angular.io) y [Supabase](https://supabase.com/docs).
