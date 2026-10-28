# Práctica 17 · Rutas protegidas e inscripciones

Cliente React + Vite para la API del gimnasio. La API corre en `http://localhost:3000` y el cliente en `http://localhost:5173`.

## Iniciar

Desde la raíz del repositorio, inicia la API con `npm run start:dev`. En otra terminal:

```powershell
cd practica-17
npm install
npm run dev
```

Las cuentas del seeder usan la contraseña `gimnasio2026`. `karla@itson.mx` es la cuenta de miembro vinculada a un registro de miembro. Las cuentas de entrenadora y administración pueden iniciar sesión, pero la API responde 403 si intentan inscribirse o consultar inscripciones propias.

## Respuestas del ejercicio

### ¿La ruta protegida hace segura la aplicación? ¿Qué protege los datos?

No. La ruta protegida controla la navegación y la interfaz del navegador; alguien puede saltársela y enviar solicitudes directamente. Los datos los protege el backend: el guard JWT valida la identidad, y el controlador limita la operación al rol de miembro y al `miembroId` incluido en las claims firmadas del token.

### ¿Por qué no se manda `miembroId` al inscribirse?

El cliente solo envía `horarioId`. La API obtiene `miembroId` del JWT validado y lo usa para crear la inscripción. Así el cliente no puede cambiar ese identificador para inscribir a otra persona.

### ¿Cuál es la diferencia entre 401 y 403?

401 significa que la petición no tiene una autenticación válida, porque falta el token o venció. 403 significa que la identidad sí está autenticada, pero no tiene permiso para la acción; por ejemplo, una cuenta de entrenador no puede inscribirse como miembro.

## Comprobación de la API

Sin token, esta solicitud debe responder `401 Unauthorized`:

```powershell
curl.exe -i http://localhost:3000/inscripciones/mias
```

Después de iniciar sesión, revisa la pestaña **Red** del navegador. `GET /inscripciones/mias` y `POST /inscripciones` deben incluir `Authorization: Bearer <token>`. El cuerpo del POST contiene únicamente el identificador del horario:

```json
{ "horarioId": 1 }
```

Si el horario está lleno o la persona intenta inscribirse dos veces, la API devuelve `409` y la página muestra el mensaje recibido. Una cuenta sin vínculo con un miembro devuelve `403`. Si la inscripción se confirma, el cliente vuelve a consultar `GET /horarios/:id` para actualizar los lugares disponibles.

## Implementación

- `RutaProtegida` cubre `/mis-inscripciones` y conserva la ruta solicitada. Tras iniciar sesión, la navegación vuelve a esa página.
- Los servicios en `src/lib/inscripciones.ts` llaman a `GET /inscripciones/mias` y `POST /inscripciones`.
- El interceptor de respuesta elimina la sesión local y redirige a **Entrar** cuando una petición autenticada responde 401.
- La API calcula los lugares libres contando únicamente las inscripciones confirmadas.
- `node_modules/` y `dist/` están excluidos por el `.gitignore` de la raíz.
