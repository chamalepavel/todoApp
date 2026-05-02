# Evidencia Tarea 8 — Validación de Input y Manejo de Errores

## Curl 1: Crear tarea sin título → esperado 422

**Comando ejecutado:**
```bash
curl -s -X POST http://localhost:3000/api/tareas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Respuesta obtenida:**
```json
{"error":["El título es obligatorio"]}
```

---

## Curl 2: Crear tarea con título vacío → esperado 422

**Comando ejecutado:**
```bash
curl -s -X POST http://localhost:3000/api/tareas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```

**Respuesta obtenida:**
```json
{"error":["El título no puede estar vacío"]}
```

---

## Curl 3: ID inválido → esperado 400 sin stack trace

**Comando ejecutado:**
```bash
curl -s http://localhost:3000/api/tareas/id-que-no-existe \
  -H "Authorization: Bearer <token>"
```

**Respuesta obtenida:**
```json
{"error":"Invalid request"}
```

---

## Curl 4: Crear tarea válida → esperado 201

**Comando ejecutado:**
```bash
curl -s -X POST http://localhost:3000/api/tareas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi tarea"}'
```

**Respuesta obtenida:**
```json
{"_id":"...","title":"Mi tarea","completed":false,"ownerId":"...","__v":0}
```
