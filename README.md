# Task University

Sistema de gestion de tareas academicas desarrollado como Trabajo Practico Calificado.

## Descripcion

Aplicacion web full-stack para la gestion de tareas academicas. Incluye autenticacion
con JWT, gestion de usuarios, categorias, dashboard estadistico y auditoria de acciones.

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- MySQL2
- JSON Web Token (JWT)
- Bcryptjs

### Base de Datos
- MySQL (XAMPP)

### Control de Versiones
- Git
- GitHub
- GitHub Actions

## Equipo de Desarrollo

| Integrante | Rol | Rama |
|------------|-----|------|
| Angel (anduar0109vk-del) | Backend y Autenticacion | feature-autenticacion |
| Integrante 2 | Tareas y Categorias | feature-tareas |
| Integrante 3 | Frontend y Dashboard | feature-dashboard |

## Estructura del Proyecto

task-university/
  backend/          API RESTful con Express
    config/         Configuracion de base de datos
    controllers/    Logica de negocio
    middleware/     Autenticacion y validaciones
    models/         Modelos de datos
    routes/         Rutas de la API
    scripts/        Scripts de inicializacion
    server.js       Punto de entrada
  frontend/         Interfaz de usuario con React
    src/
      components/   Componentes reutilizables
      pages/        Paginas de la aplicacion
      services/     Servicios de API
      context/      Contexto de React
  .github/
    workflows/      Configuracion de CI/CD

## Requisitos Previos

- Node.js 20 o superior
- XAMPP con MySQL
- Git
- Visual Studio Code

## Instalacion

### 1. Clonar el repositorio

git clone https://github.com/anduar0109vk-del/task-university.git
cd task-university

### 2. Configurar la base de datos

Abrir XAMPP, iniciar Apache y MySQL.
Acceder a http://localhost/phpmyadmin
Ejecutar el script SQL ubicado en backend/database/task_university.sql

### 3. Configurar el backend

cd backend
npm install
node scripts/seed.js
npm run dev

El backend se ejecutara en http://localhost:4000

### 4. Configurar el frontend

cd frontend
npm install
npm run dev

El frontend se ejecutara en http://localhost:5173

## Credenciales Iniciales

| Campo | Valor |
|-------|-------|
| Usuario | admin |
| Contrasena | Admin123! |

Nota: Estas credenciales son las unicas predefinidas. Los demas usuarios
deben ser creados desde la interfaz de administracion.

## Modulos del Sistema

1. Autenticacion: Login con JWT y gestion de sesiones
2. Gestion de Usuarios: Registro, listado, edicion y eliminacion
3. Gestion de Tareas: Registrar, editar, eliminar y marcar completadas
4. Gestion de Categorias: Organizacion de tareas por categoria
5. Dashboard: Estadisticas de tareas totales, completadas y pendientes
6. Reportes: Generacion de reportes de productividad
7. Auditoria: Registro de acciones realizadas en el sistema

## Flujo de Trabajo Git

El proyecto utiliza el siguiente flujo de ramas:

main
  develop
    feature-autenticacion
    feature-tareas
    feature-dashboard
    feature-categorias
    feature-reportes
    feature-auditoria

Cada funcionalidad se desarrolla en su rama, se integra a develop mediante
Pull Request, y finalmente develop se fusiona con main para las versiones estables.

## Integracion Continua

El proyecto utiliza GitHub Actions para:
- Validacion de codigo
- Ejecucion de pruebas
- Construccion del frontend
- Despliegue automatico

## Licencia

Proyecto academico - Trabajo Practico Calificado
