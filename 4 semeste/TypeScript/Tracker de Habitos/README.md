# Tracker de Hábitos

Aplicación web para seguimiento y gestión de hábitos personales.

## Descripción

Esta aplicación permite crear, editar y seguir el progreso de hábitos diarios. Incluye funcionalidades para visualizar estadísticas y mantener un registro constante de las actividades.

## Tecnologías

- React con TypeScript
- Redux Toolkit para manejo de estado
- Express para el backend
- SQLite como base de datos
- CSS para estilos

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/chamalepavel/Tracker-de-Habitos.git
cd Tracker-de-Habitos
```

2. Instalar dependencias:
```bash
npm install
```

## Uso

Para ejecutar la aplicación:

1. Iniciar el backend:
```bash
cd backend
node server.js
```

2. En otra terminal, iniciar el frontend:
```bash
npm start
```

La aplicación estará disponible en http://localhost:3000

## Scripts Disponibles

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm build`: Crea la build de producción
- `npm test`: Ejecuta las pruebas

## Estructura del Proyecto

- `src/components/`: Componentes de React
- `src/features/`: Slice de Redux para gestión de estado
- `src/hooks/`: Hooks personalizados
- `src/models/`: Definiciones de tipos TypeScript
- `backend/`: Servidor Express con base de datos SQLite
