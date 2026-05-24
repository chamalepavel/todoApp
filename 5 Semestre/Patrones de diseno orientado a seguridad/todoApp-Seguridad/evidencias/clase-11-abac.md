# Clase 11 — Control de permisos basado en atributos (ABAC)

## Política implementada

La política usa el `userId` del usuario autenticado (extraído del JWT), el `projectId` almacenado en la tarea y el `role` guardado en la membresía del proyecto en MongoDB. Con esos tres atributos se decide si el usuario puede leer, crear o editar tareas. Además, para el rol `developer` se valida que el `ownerId` de la tarea sea igual al `userId` del usuario, de modo que solo pueda editar sus propias tareas y no las de otros.

---

## Guía de prueba paso a paso

Antes de pegar los resultados, sigue estos pasos para preparar el entorno de prueba.

### Paso 1 — Levantar el servidor

```
npm start
```

El servidor corre en http://localhost:3000

---

### Paso 2 — Registrar tres usuarios

Registra un viewer:
```
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"viewer@test.com\",\"password\":\"Password123!\"}"
```
Guarda el `accessToken` y el `id` del usuario.

Registra un developer:
```
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"developer@test.com\",\"password\":\"Password123!\"}"
```
Guarda el `accessToken` y el `id` del usuario.

Registra un developer2 (para probar que developer no puede editar tarea ajena):
```
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"developer2@test.com\",\"password\":\"Password123!\"}"
```
Guarda el `accessToken` y el `id` del usuario.

Registra un project_admin:
```
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"Password123!\"}"
```
Guarda el `accessToken` y el `id` del usuario.

---

### Paso 3 — Crear un proyecto

```
curl -s -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CUALQUIERA>" \
  -d "{\"name\":\"Proyecto Demo\"}"
```
Guarda el `projectId` que devuelve.

---

### Paso 4 — Crear membresías

Reemplaza `<PROJECT_ID>`, `<VIEWER_USER_ID>`, `<DEVELOPER_USER_ID>`, `<DEVELOPER2_USER_ID>` y `<ADMIN_USER_ID>` con los valores reales.

```
curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CUALQUIERA>" \
  -d "{\"userId\":\"<VIEWER_USER_ID>\",\"role\":\"viewer\"}"

curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CUALQUIERA>" \
  -d "{\"userId\":\"<DEVELOPER_USER_ID>\",\"role\":\"developer\"}"

curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CUALQUIERA>" \
  -d "{\"userId\":\"<DEVELOPER2_USER_ID>\",\"role\":\"developer\"}"

curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CUALQUIERA>" \
  -d "{\"userId\":\"<ADMIN_USER_ID>\",\"role\":\"project_admin\"}"
```

---

### Paso 5 — Crear una tarea con el developer (para tener algo que editar)

```
curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DEVELOPER_TOKEN>" \
  -d "{\"title\":\"Tarea del developer\"}"
```
Guarda el `_id` de la tarea. Ese es tu `<TASK_ID>`.

---

## Curl 1: viewer lee tarea → 200

Comando:
```
curl -s -X GET http://localhost:3000/api/projects/<PROJECT_ID>/tasks \
  -H "Authorization: Bearer <VIEWER_TOKEN>"
```

Output real:

```
[PEGAR AQUÍ EL OUTPUT REAL]
```

---

## Curl 2: viewer intenta crear → 403

Comando:
```
curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VIEWER_TOKEN>" \
  -d "{\"title\":\"Tarea no permitida\"}"
```

Output real:

```
[PEGAR AQUÍ EL OUTPUT REAL]
```

---

## Curl 3: developer edita tarea ajena → 403

Primero crea una tarea con developer2 para que developer no sea el dueño:
```
curl -s -X POST http://localhost:3000/api/projects/<PROJECT_ID>/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DEVELOPER2_TOKEN>" \
  -d "{\"title\":\"Tarea del developer2\"}"
```
Guarda ese `_id` como `<TASK_ID_AJENA>`.

Ahora intenta editarla con developer (el que no la creó):
```
curl -s -X PUT http://localhost:3000/api/projects/<PROJECT_ID>/tasks/<TASK_ID_AJENA> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DEVELOPER_TOKEN>" \
  -d "{\"title\":\"Intento de edicion\",\"completed\":false}"
```

Output real:

```
[PEGAR AQUÍ EL OUTPUT REAL]
```

---

## Extra — developer edita su propia tarea → 200

Comando:
```
curl -s -X PUT http://localhost:3000/api/projects/<PROJECT_ID>/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DEVELOPER_TOKEN>" \
  -d "{\"title\":\"Tarea editada por su dueño\",\"completed\":true}"
```

Output real:

```
[PEGAR AQUÍ EL OUTPUT REAL]
```

---

## Extra — project_admin edita cualquier tarea → 200

Comando:
```
curl -s -X PUT http://localhost:3000/api/projects/<PROJECT_ID>/tasks/<TASK_ID_AJENA> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"title\":\"Editada por admin\",\"completed\":true}"
```

Output real:

```
[PEGAR AQUÍ EL OUTPUT REAL]
```
