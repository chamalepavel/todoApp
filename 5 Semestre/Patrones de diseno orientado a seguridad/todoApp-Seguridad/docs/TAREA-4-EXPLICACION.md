# Tarea 4 - Token Service

## De que se trataba la tarea

La tarea pedía agregar un sistema de autenticación con JWT a una app de tareas que ya existía. En lugar de usar solo un token como antes, ahora se usan dos: uno de acceso corto (15 minutos) y uno de refresco largo (7 días). Cuando el de acceso vence, el usuario puede pedir uno nuevo usando el de refresco sin tener que volver a poner su contraseña.

---

## Que se creo y para que sirve

**src/models/user.model.js**
Guarda los usuarios en la base de datos. Tiene email, contraseña (encriptada) y rol.

**src/services/tokenService.js**
Es el corazón de la tarea. Genera los dos tokens JWT, los guarda en un Map en memoria, y cuando se hace refresh, borra el token viejo y crea uno nuevo. Eso se llama rotación. Si alguien intenta usar un token que ya fue rotado o invalidado, el sistema lo rechaza.

**src/services/authGateway.js**
Maneja el login y el register. Busca al usuario en la base de datos, verifica la contraseña y llama al tokenService para generar los tokens.

**src/routes/auth.js**
Tiene cuatro rutas:
- POST /api/auth/register — crea una cuenta nueva
- POST /api/auth/login — inicia sesion y devuelve ambos tokens
- POST /api/auth/refresh — recibe el refresh token y devuelve un par nuevo
- POST /api/auth/logout — invalida el refresh token para cerrar sesion

**src/middlewares/auth.js**
Antes verificaba el token comparandolo como texto plano. Ahora usa jwt.verify() real para validar el access token en cada peticion protegida.

---

## Como funciona el flujo en palabras normales

1. El usuario se registra o hace login. El servidor le manda dos tokens.
2. El usuario usa el access token para hacer peticiones normales (como ver sus tareas).
3. Cuando el access token vence a los 15 minutos, el usuario manda el refresh token al endpoint /refresh.
4. El servidor verifica que ese refresh token exista en el store, lo borra, y genera un par nuevo.
5. Si alguien intenta usar el refresh token viejo otra vez, el servidor lo rechaza.
6. Cuando el usuario hace logout, el refresh token se borra del store y ya no sirve.

---

## Los 5 tests

Los tests estan en tests/integration/auth.test.js y usan una base de datos falsa en memoria para no necesitar MongoDB real.

**Test 1 - Login devuelve accessToken y refreshToken**
Registra un usuario, hace login, y verifica que la respuesta traiga ambos tokens y el email del usuario.

**Test 2 - Access token permite acceder a tareas**
Hace login, toma el accessToken, y lo usa en el header Authorization para pedir GET /api/tareas. Verifica que responda 200.

**Test 3 - Refresh genera tokens nuevos**
Hace login, toma el refreshToken, lo manda a /refresh, y verifica que lleguen tokens nuevos y que el refreshToken nuevo sea diferente al viejo.

**Test 4 - Refresh token viejo es rechazado despues de rotar**
Hace login, usa el refreshToken una vez en /refresh para rotarlo, luego intenta usarlo de nuevo. Verifica que el servidor responda 401 con el mensaje "Invalid or revoked refresh token".

**Test 5 - Logout invalida el refresh token**
Hace login, hace logout con el refreshToken, verifica que responda "Logged out successfully", luego intenta hacer refresh con ese mismo token y verifica que sea rechazado con 401.

---

## Resultado

Los 5 tests pasan. El codigo esta en https://github.com/chamalepavel/todoApp
