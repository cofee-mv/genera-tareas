# 🤝 Contribuir a Task Manager CBA

Nos alegra que quieras contribuir al proyecto. Este documento te guiará a través del proceso.

## Cómo Contribuir

### 1. Fork el Repositorio

1. Ve a [GitHub](https://github.com/tu-usuario/task-manager-cba)
2. Haz clic en "Fork" (esquina superior derecha)
3. Se creará una copia en tu cuenta

### 2. Clonar tu Fork

```bash
git clone https://github.com/tu-usuario/task-manager-cba.git
cd task-manager-cba
```

### 3. Crear una Rama para tu Cambio

```bash
git checkout -b feature/tu-nueva-caracteristica
```

Nombres sugeridos:
- `feature/nueva-funcionalidad` - Para nuevas características
- `fix/corregir-bug` - Para correcciones
- `docs/actualizar-documentacion` - Para documentación

### 4. Hacer tus Cambios

1. Edita los archivos necesarios
2. Prueba los cambios localmente:
   ```bash
   npm start
   ```
3. Verifica que no hay errores de compilación

### 5. Commit de los Cambios

```bash
git add .
git commit -m "Descripción clara de lo que cambiaste"
```

Usa mensajes descriptivos:
- ✅ `Agregar filtro por prioridad en lista de tareas`
- ❌ `fix`

### 6. Push a tu Fork

```bash
git push origin feature/tu-nueva-caracteristica
```

### 7. Crear un Pull Request

1. Ve a tu repositorio en GitHub
2. Haz clic en "New Pull Request"
3. Selecciona tu rama y describe los cambios
4. Proporciona detalles sobre:
   - Qué cambió
   - Por qué cambió
   - Cómo probarlo

## Guías de Estilo

### Código TypeScript/Angular

```typescript
// Usar camelCase para variables y métodos
let nombreVariable = 'valor';
function miMetodo() { }

// Usar PascalCase para clases e interfaces
class MiClase { }
interface MiInterfaz { }

// Documentar métodos públicos
/**
 * Obtiene los proyectos del usuario
 * @returns Promise<Proyecto[]>
 */
async getProyectos(): Promise<Proyecto[]> {
  // ...
}
```

### CSS

```css
/* Usar kebab-case para clases */
.mi-clase { }
.mi-clase--modificador { }

/* Comentar estilos complejos */
/* Grid layout para lista de tareas */
.lista-tareas {
  display: grid;
}
```

### Commit Messages

Usa el formato:
```
<tipo>: <descripción breve>

<descripción detallada si es necesaria>
```

Tipos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `refactor`: Cambios de código sin funcionalidad nueva
- `test`: Agregar o actualizar tests
- `style`: Cambios de formato

Ejemplo:
```
feat: Agregar búsqueda por nombre en tareas

- Implementar input de búsqueda
- Actualizar servicio de tareas
- Agregar filtro al componente lista
```

## Reportar Bugs

### Usar GitHub Issues

1. Ve a **Issues** en el repositorio
2. Haz clic en "New Issue"
3. Completa el template:
   - Titulo descriptivo
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Entorno (SO, navegador, versión)

Ejemplo:
```
Titulo: Error al crear proyecto sin nombre

Descripción:
Al intentar crear un proyecto sin ingresar un nombre, 
la aplicación muestra un error 500 en lugar de 
una validación clara.

Pasos para reproducir:
1. Ir a /proyectos/nuevo
2. Dejar el campo nombre vacío
3. Hacer clic en "Crear"

Esperado: Mostrar mensaje "El nombre es requerido"
Actual: Error 500 en la consola
```

## Sugerir Mejoras

1. Abre un **Issue** con el label `enhancement`
2. Describe la mejora propuesta
3. Proporciona ejemplos si es posible
4. Espera feedback de los mantenedores

## Proceso de Revisión

1. El mantenedor revisará tu PR
2. Pueden pedir cambios o mejoras
3. Responde a los comentarios
4. Una vez aprobado, se hará merge

## Código de Conducta

- Sé respetuoso con otros contribuidores
- Proporciona feedback constructivo
- Evita lenguaje ofensivo
- Ayuda a otros a aprender

## Preguntas Frecuentes

**¿Puedo trabajar en una issue que alguien más reportó?**
Sí, comenta en la issue que te gustaría trabajar en ella.

**¿Qué si mi PR no es aceptado?**
Solicitaremos cambios o explicaremos por qué no se puede aceptar. Siempre podés mejorar y resubmitir.

**¿Hay requisitos de cobertura de código?**
No obligatorio, pero se aprecia. Usa `npm test` para verificar.

## Contacto

- 📧 Email: info@cba-formacion.com
- 💬 Discussions: GitHub Discussions
- 🐛 Bugs: GitHub Issues

---

¡Gracias por contribuir! 🎉
