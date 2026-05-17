## Clase 10 - Audit Logging / Bitácora de Auditoría

### Objetivo de la tarea

Implementar un sistema de audit log dentro del proyecto que ya venimos usando en clase. El objetivo es registrar en la base de datos los eventos de seguridad más importantes: logins, registros, intentos fallidos, accesos denegados, rate limiting y operaciones sobre recursos. Esto nos permite investigar qué pasó, quién lo hizo y desde dónde, sin tener que adivinar.

---

### Repositorio / Fork usado

https://github.com/chamalepavel/jest-lab-validacion

Rama de entrega: `clase-10-audit-log`

---

### Commits entregados

1. `feat: add audit log model, service and action constants`
2. `feat: integrate audit logging in auth, tareas and rate limiter`
3. `docs: add audit log evidence for clase-10`

---

### Archivos creados

- `src/constants/auditActions.js` — constantes con los nombres de cada acción registrada
- `src/models/auditLog.model.js` — modelo Mongoose que define la estructura del documento en MongoDB
- `src/services/auditLog.service.js` — función que guarda el evento en la base de datos
- `src/routes/admin.routes.js` — ruta protegida para que un admin consulte los logs

### Archivos modificados

- `src/routes/auth.js` — se agregó registro en register, login exitoso, login fallido y logout
- `src/security/rateLimiter.js` — se agregó registro cuando se supera el rate limit
- `src/routes/tareas.js` — se agregó registro en creación, eliminación y accesos 403
- `src/app.js` — se registró la nueva ruta `/api/admin`

---

### Eventos registrados

| Acción | Cuándo se dispara |
|---|---|
| USER_REGISTER | Un usuario nuevo se registra exitosamente |
| LOGIN_SUCCESS | Un usuario inicia sesión correctamente |
| LOGIN_FAILED | Se intenta iniciar sesión con credenciales incorrectas |
| LOGOUT | Un usuario cierra sesión |
| RATE_LIMIT_EXCEEDED | Se superan los intentos permitidos en login o registro |
| FORBIDDEN_ACCESS | Un usuario intenta modificar o eliminar una tarea que no le pertenece |
| TAREA_CREATED | Un usuario crea una tarea nueva |
| TAREA_DELETED | Un usuario elimina una de sus tareas |

---

### Evidencias con screenshots

- `screenshots/01-register-success.png` — POST /api/auth/register con respuesta 201
- `screenshots/02-login-success.png` — POST /api/auth/login con respuesta 200
- `screenshots/03-login-failed.png` — POST /api/auth/login con password incorrecto, respuesta 401
- `screenshots/04-audit-logs-db.png` — GET /api/admin/audit-logs mostrando los documentos guardados
- `screenshots/05-forbidden-access.png` — DELETE /api/tareas/:id con tarea ajena, respuesta 403
- `screenshots/06-rate-limit.png` — Más de 5 intentos de login, respuesta 429

---

### Nota de seguridad

En ningún documento del audit log se guarda la contraseña del usuario, el access token, el refresh token ni ningún dato sensible. Solo se guarda el email, la IP, el user agent, la acción que ocurrió y metadata descriptiva como el título de la tarea o la razón del error. Esto sigue la práctica de registrar solo lo necesario para investigar, sin exponer información crítica.
