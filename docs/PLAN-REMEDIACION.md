# Plan de Remediación — todoApp

RESUMEN EJECUTIVO

Estado actual de la app: aplicación Node/Express con API REST para tareas, sin medidas de seguridad.
Objetivo del plan: corregir 12 vulnerabilidades OWASP y adicionales, aplicando principios de diseño seguro.

VULNERABILIDADES IDENTIFICADAS

A continuación se enumeran las fallas que detectamos en la aplicación. Cada punto incluye una breve descripción, la gravedad que le asignamos y el principio de diseño que ayuda a remediarla:

- Sin autenticación en ningún endpoint: acceso abierto a la API. Crítica (A07, menor privilegio). Resolver con un middleware `auth`.
- IDOR — modifica/borra tareas ajenas: falta control de acceso. Alta (A01, separación de responsabilidades). Comprobar el `ownerId` antes de actualizar o borrar.
- Acepta `<script>` como título (XSS): entrada no validada. Alta (A03, fail secure). Validar con Joi y bloquear HTML.
- err.message expuesto al cliente: información sensible en errores. Media (A04, defensa en profundidad). Usar un manejador de errores genérico.
- Sin rate limiting — DoS trivial: sin límite de peticiones. Media (A04, defensa en profundidad). Agregar `express-rate-limit`.
- MongoDB sin autenticación: base de datos abierta. Crítica (A05, economía de mecanismo). Mover la cadena a `.env` y habilitar credenciales en Docker.
- Mass assignment sin restricción: se permite cualquier campo en el modelo. Alta (A04, seguro por defecto). Filtrar con Joi (`allowUnknown:false`).
- Sin CORS configurado: cualquier origen puede llamar la API. Media (A05, zero trust). Definir una lista de orígenes aceptables en `cors.js`.
- Sin headers de seguridad (Helmet): faltan encabezados HTTP recomendados. Media (A05, defensa en profundidad). Instalar y usar `helmet()`.
- Sin audit logs: no se registra actividad útil. Media (A09, auditoría). Añadir `console.log` o un logger en puntos clave.
- Sin HTTPS: tráfico sin cifrar. Crítica (A02, fail secure). Documentar en el README y configurar proxy TLS.
- Connection string hardcodeada: URI de Mongo visible en código. Alta (A05, economía de mecanismo). Pasar la cadena por variables de entorno.


DETALLE DE VULNERABILIDADES

1. VULNERABILIDAD: SIN AUTENTICACIÓN EN NINGÚN ENDPOINT

se vería en `src/middlewares/auth.js` y en las rutas bajo `src/routes/tareas.js`
- **Severidad**: Crítica
- **OWASP**: A07 — Identificación y Autenticación Incorrectas
- **Principio violado**: Menor Privilegio
- **Descripción**: La API permite el acceso anónimo general; un atacante puede leer y modificar cualquier recurso.
- **Solución concreta**: Agregar middleware `src/middlewares/auth.js` que verifique `Authorization: Bearer <token>` igual a `process.env.APP_SECRET`. Añadir `router.use(auth)` o incluirlo en cada ruta.
- **Clase del curso**: Clase 2

2. VULNERABILIDAD: IDOR — MODIFICA/BORRA TAREAS AJENAS

se manifiesta en el modelo `src/models/tarea.model.js` y en validaciones de `src/routes/tareas.js`
- **Severidad**: Alta
- **OWASP**: A01 — Control de Acceso
- **Principio violado**: Separación de Responsabilidades
- **Descripción**: La actualización/elimnación de tareas se basa solo en el ID; no se comprueba que la tarea pertenezca al usuario.
- **Solución concreta**: Agregar campo `ownerId` en el esquema y comparar `req.user.id` con `tarea.ownerId` antes de modificar/eliminar. Si no coincide, retornar 403.
- **Clase del curso**: Clase 2

3. VULNERABILIDAD: ACEPTA `<script>` COMO TÍTULO (XSS)

contenida en el middleware de validación `src/middlewares/validateTarea.js`
- **Severidad**: Alta
- **OWASP**: A03 — Cross Site Scripting (XSS)
- **Principio violado**: Fail Secure
- **Descripción**: El título no es sanitizado ni validado; un vector XSS puede ejecutarse en el cliente que consume la API.
- **Solución concreta**: Implementar validator con Joi en `src/middlewares/validateTarea.js` que rechace `<` o `>` y limite longitud 3‑200. Usar `allowUnknown:false` para evitar campos extra.
- **Clase del curso**: Clase 2

4. VULNERABILIDAD: ERR.MESSAGE EXPUESTO AL CLIENTE

ver en los catch de `src/routes/tareas.js` y en `src/middlewares/errorHandler.js`
- **Severidad**: Media
- **OWASP**: A04 — Exposición de Datos Sensibles
- **Principio violado**: Defensa en Profundidad
- **Descripción**: En capturas de excepción se envía `err.message` en la respuesta; puede filtrar información de la base de datos.
- **Solución concreta**: Reemplazar todos los `res.status(500).json({ error: err.message })` por middleware de error global (`src/middlewares/errorHandler.js`) que retorna mensaje genérico y guarda el error en log.
- **Clase del curso**: Clase 3

5. VULNERABILIDAD: SIN RATE LIMITING — DOS TRIVIAL

se implementa con `src/middlewares/rateLimiter.js` y se usa en rutas
- **Severidad**: Media
- **OWASP**: A04 — Exposición de Datos Sensibles (aunque más apropiado DoS)
- **Principio violado**: Defensa en Profundidad
- **Descripción**: No hay control de frecuencia; un cliente puede inundar el servidor con solicitudes.
- **Solución concreta**: Usar `express-rate-limit` en cada ruta o globalmente, con 100 req por 10 minutos. Middleware en `src/middlewares/rateLimiter.js`.
- **Clase del curso**: Clase 3

6. VULNERABILIDAD: MONGODB SIN AUTENTICACIÓN

afeca `docker-compose.yml` y el archivo `src/config/index.js` donde se lee la URI
- **Severidad**: Crítica
- **OWASP**: A05 — Configuración de Seguridad Incorrecta
- **Principio violado**: Economía de Mecanismo
- **Descripción**: El servicio Mongo está accesible sin credenciales; cualquier proceso local o remoto puede conectarse.
- **Solución concreta**: Configurar usuario/contraseña en `docker-compose.yml` y usar `MONGO_URI` con credenciales guardadas en `.env`. Cambiar `src/config/index.js` para leer la variable.

7. VULNERABILIDAD: MASS ASSIGNMENT SIN RESTRICCIÓN

relacionada con la validación de entradas en `src/middlewares/validateTarea.js`
- **Severidad**: Alta
- **OWASP**: A04 — Exposición de Datos Sensibles
- **Principio violado**: Seguro por Defecto
- **Descripción**: El objeto `req.body` se pasa directamente al constructor de Mongoose; campos arbitrarios pueden escribirse en el modelo.
- **Solución concreta**: Validar y filtrar con Joi (`allowUnknown:false`) y en el `PUT` solo extraer `title` y `completed`. No usar `...req.body`.
- **Clase del curso**: Clase 2

8. VULNERABILIDAD: SIN CORS CONFIGURADO

archivo `src/config/cors.js` y su uso en `src/app.js`
- **Severidad**: Media
- **OWASP**: A05 — Configuración de Seguridad Incorrecta
- **Principio violado**: Zero Trust
- **Descripción**: El servidor acepta peticiones desde cualquier origen, lo que facilita ataques desde sitios maliciosos.
- **Solución concreta**: Añadir `src/config/cors.js` con lista blanca `origin` y registrar en `app.js` antes de las rutas.
- **Clase del curso**: Clase 4

9. VULNERABILIDAD: SIN HEADERS DE SEGURIDAD (HELMET)

implementada en `src/middlewares/securityHeaders.js` y registrada en `src/app.js`
- **Severidad**: Media
- **OWASP**: A05 — Configuración de Seguridad Incorrecta
- **Principio violado**: Defensa en Profundidad
- **Descripción**: La aplicación no envía encabezados como `X-Frame-Options`, `X-Content-Type-Options`, etc.
- **Solución concreta**: Instalar `helmet` y ejecutar `app.use(helmet())` en `src/app.js`.
- **Clase del curso**: Clase 4

10. VULNERABILIDAD: SIN AUDIT LOGS

logs agregados en `src/middlewares/auth.js` y puntos clave como creación de tareas
- **Severidad**: Media
- **OWASP**: A09 — Uso de Componentes Vulnerables y Registro Insuficiente
- **Principio violado**: Menor Privilegio / Defensa en Profundidad
- **Descripción**: No hay registro de operaciones sensibles; no se puede rastrear actividad maliciosa.
- **Solución concreta**: Insertar líneas de `console.log` en middleware `auth` y en creaciones/ediciones de tareas. Od preferible utilizar Winston y almacenar en archivo.
- **Clase del curso**: Clase 5

11. VULNERABILIDAD: SIN HTTPS

configuración en `src/server.js` y nota en `README.md`
- **Severidad**: Crítica
- **OWASP**: A02 — Configuración de Seguridad Incorrecta
- **Principio violado**: Fail Secure
- **Descripción**: El servidor se expone en HTTP; credenciales y datos viajan en claro.
- **Solución concreta**: Documentar en `README.md` que el despliegue debe hacerse detrás de un proxy TLS o activar `app.set('trust proxy',1)` y utilizar `NODE_ENV=production`.
- **Clase del curso**: Clase 4

12. VULNERABILIDAD: CONNECTION STRING HARDCODEADA

detectable en `src/server.js` previamente y corregido en `src/config/index.js`
- **Severidad**: Alta
- **OWASP**: A05 — Configuración de Seguridad Incorrecta
- **Principio violado**: Economía de Mecanismo
- **Descripción**: La URI de Mongo se encuentra directamente en código fuente (p.ej. en `src/config/index.js`).
- **Solución concreta**: Remover cadenas de texto del código, usar `process.env.MONGO_URI` en `.env` y en `docker-compose.yml` la variable de ambiente.
- **Clase del curso**: Clase 4


