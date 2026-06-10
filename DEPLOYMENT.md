# 🚀 Guía de Despliegue en Vercel

## Pasos Rápidos para Desplegar en Vercel

### 1. Preparar el Código

```bash
# Asegúrate de que todo está en GitHub
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Conectar a Vercel

1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Haz clic en "Add New..." → "Project"
4. Selecciona el repositorio `task-manager-cba`
5. Vercel detectará automáticamente que es un proyecto Angular

### 3. Configurar Variables de Entorno

En la pantalla de configuración de Vercel, antes de hacer deploy:

1. Busca la sección **Environment Variables**
2. Agrega estas variables:

| Nombre | Valor |
|--------|-------|
| `NG_APP_SUPABASE_URL` | Tu URL de Supabase (ej: `https://abc123.supabase.co`) |
| `NG_APP_SUPABASE_ANON_KEY` | Tu clave anónima de Supabase |

**Para obtener estas credenciales:**
1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia `Project URL` y `anon public`

### 4. Hacer Deploy

1. Vercel compilará y desplegará automáticamente
2. Espera 2-5 minutos para que se complete
3. Recibirás una URL como: `https://task-manager-cba.vercel.app`

### 5. Verificar el Despliegue

1. Abre la URL en tu navegador
2. Intenta registrarte y acceder
3. Verifica que la conexión a Supabase funcione

## Solución de Problemas de Despliegue

### Error: "Credenciales de Supabase inválidas"

- Verifica que las variables de entorno estén correctas en Vercel
- Recopia las credenciales de Supabase
- Redeploy haciendo push a GitHub

### Error: "Module not found"

- Verifica que todas las importaciones sean correctas
- Asegúrate de que no hay errores de TypeScript
- Revisa los logs en Vercel

### Error: "Build failed"

- Haz clic en el deployment fallido en Vercel
- Lee los logs para ver qué salió mal
- Generalmente es un problema de dependencias o sintaxis

## Despliegues Futuros

Cualquier push a `main` desplegará automáticamente:

```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

Vercel recreará el proyecto automáticamente.

## Staging/Preview Deployments

Cuando abres un Pull Request, Vercel crea automáticamente un despliegue de vista previa para probar cambios antes de hacer merge.

---

Para más información, consulta la [documentación de Vercel para Angular](https://vercel.com/docs/frameworks/angular).
