Prueba de colaboración - Gianfranco
# Task University

Sistema web para organizar tareas academicas, usuarios y categorias. El proyecto
incluye autenticacion, permisos por rol, dashboard, auditoria y una interfaz React.

## Tecnologias

- Frontend: React 19, Vite y CSS propio.
- Backend: Node.js, Express 5, JWT, bcryptjs y MySQL2.
- Base de datos: MySQL administrado con XAMPP.
- CI: GitHub Actions, GitLab CI/CD y Azure Pipelines.

## Funcionalidades

- Inicio y cierre de sesion con JWT.
- Recuperacion de la sesion al recargar la aplicacion.
- Gestion de tareas: crear, editar, eliminar, filtrar y completar.
- Prioridad, estado, fecha limite y categoria para cada tarea.
- Gestion administrativa de usuarios y roles.
- Alta y eliminacion de categorias con color y descripcion.
- Dashboard con totales, pendientes, tareas en progreso y completadas.
- Auditoria de accesos y operaciones administrativas.

## Requisitos

- Node.js 20 o superior.
- npm.
- XAMPP con MySQL iniciado.
- Git.

## Configurar MySQL con XAMPP

1. Inicia MySQL desde el panel de XAMPP.
2. Abre `http://localhost/phpmyadmin`.
3. Crea una base de datos llamada `task_university`.
4. Ejecuta en esa base el esquema SQL entregado para el proyecto, incluyendo las
   tablas `usuarios`, `categorias`, `tareas`, `sesiones` y `auditoria`.

La configuracion predeterminada usa:

```text
Host: 127.0.0.1
Puerto: 3306
Usuario: root
Contrasena: vacia
Base de datos: task_university
```

Puedes personalizarla copiando `backend/.env.example` como `backend/.env`.

## Ejecutar localmente

Abre dos terminales desde la raiz del repositorio.

### Backend

```powershell
cd backend
npm install
npm run seed
npm start
```

La API queda disponible en `http://localhost:4000`.
El endpoint `http://localhost:4000/api/health` permite comprobar la conexion con MySQL.

Para desarrollo con reinicio automatico:

```powershell
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

La interfaz queda disponible en `http://localhost:5173`.
La URL de la API puede cambiarse con `frontend/.env`:

```text
VITE_API_URL=http://localhost:4000/api
```

## Acceso inicial

El script `npm run seed` crea o actualiza el administrador:

```text
Usuario: admin
Contrasena: Admin123!
```

Cambia esta contrasena en un entorno real y no publiques archivos `.env`.

## Estructura

```text
backend/
  config/          Conexion MySQL
  controllers/     Logica de cada modulo
  middleware/      JWT y permisos
  models/          Acceso a datos
  routes/          Endpoints REST
  scripts/         Inicializacion del administrador
  server.js        Entrada de la API
frontend/
  src/App.jsx      Interfaz y flujos principales
  src/App.css      Estilos de la aplicacion
  src/index.css    Estilos globales
.github/workflows/ci.yml  GitHub Actions
.gitlab-ci.yml             GitLab CI/CD
azure-pipelines.yml        Azure Pipelines
```

## Comandos de validacion

```powershell
cd backend
npm test

cd ..\frontend
npm run lint
npm run build
```

Los tres pipelines ejecutan estas validaciones para cambios en `main`, `develop` y
Pull Requests. El build del frontend se publica como artefacto.

## Despliegue automatico

- GitHub Actions publica `frontend/dist` en GitHub Pages despues de cada push a
  `main`. El propietario del repositorio debe configurar una vez Pages con la
  fuente `GitHub Actions` en `Settings > Pages` y crear la variable de repositorio
  `PAGES_ENABLED` con el valor `true`; despues el workflow despliega
  automaticamente.
- GitLab CI/CD publica el sitio mediante el job `pages` cuando el pipeline corre
  sobre la rama por defecto.
- Azure Pipelines publica en Azure Static Web Apps cuando existe la variable
  secreta `AZURE_STATIC_WEB_APPS_API_TOKEN`.

En los tres casos, el despliegue depende de que pasen la validacion del backend,
el lint del frontend y el build de produccion.

## Ramas

- `main`: version principal estable.
- `develop`: integracion de cambios.
- `feature-autenticacion`: login, JWT y auditoria de sesiones.
- `feature-tareas`: gestion y validacion de tareas.
- `feature-categorias`: categorias y colores.
- `feature-dashboard`: metricas y progreso.
- `feature-auditoria`: trazabilidad de operaciones.
- `feature-reportes`: espacio reservado para reportes.

Los cambios se proponen mediante Pull Request hacia `main` o `develop` y deben
pasar la integracion continua antes de fusionarse.

## Repositorio

https://github.com/anduar0109vk-del/task-university

## Licencia

Proyecto academico - Trabajo Practico Calificado.
