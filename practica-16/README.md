# Práctica 16 · Sesión y autenticación

Cliente React + Vite para la API del gimnasio. Usa el backend en `http://localhost:3000` y sirve el frontend en `http://localhost:5173`.

## Iniciar

Desde la raíz del repositorio, inicia la API con `npm run start:dev`. En otra terminal:

```powershell
cd practica-16
npm install
npm run dev
```

Si la API usa otra dirección, copia `.env.example` como `.env.local` y cambia `VITE_API_URL`.

Las cuentas del seeder son `karla@itson.mx`, `ana@itson.mx` y `admin@itson.mx`; todas usan `gimnasio2026`.

## Respuestas del ejercicio

### ¿Por qué contexto y no props para la sesión?

El encabezado y las páginas de entrar y registro necesitan leer o cambiar la sesión desde distintas partes del árbol React. El contexto ofrece ese estado al árbol debajo del proveedor y evita pasar las props de sesión por componentes intermedios que no las usan.

### ¿Qué pasa si un componente usa la sesión fuera del proveedor?

`useSesion` lanza un error que indica que el componente debe estar dentro de `SesionProvider`. Así el problema se detecta en el punto de uso, en vez de devolver silenciosamente un valor incompleto.

### ¿Dónde se guarda el token y qué riesgo tiene?

El token y los datos del usuario se guardan en `localStorage` para recuperar la sesión al recargar. Como JavaScript puede leer ese almacenamiento, un ataque XSS podría extraer el token. En una aplicación de producción conviene evaluar una cookie `HttpOnly`, `Secure` y `SameSite`, junto con la protección CSRF adecuada.

### ¿Cómo comprobar `Authorization` y leer el JWT?

1. Inicia sesión con una cuenta de prueba y abre las herramientas del navegador, pestaña **Red**.
2. Selecciona la solicitud `GET /auth/yo` y revisa **Encabezados de solicitud**: debe aparecer `Authorization: Bearer <token>`.
3. Copia el token de prueba a [jwt.io](https://jwt.io) para inspeccionar el payload (`sub`, `correo`, `rol` y `miembroId`). El payload está codificado, no cifrado; la firma detecta modificaciones, pero no oculta esos datos.

## Contrato utilizado

- `POST /auth/login` y `POST /auth/registro` reciben `correo` y `password`, y devuelven `data.access_token` dentro del sobre de respuesta de la API.
- Después, `GET /auth/yo` obtiene las claims del usuario usando el interceptor de Axios.
- El registro no envía `rol` ni `miembroId`; el backend aplica sus valores predeterminados.
- Las respuestas de error de Nest conservan su formato y el formulario muestra el campo `message` de la API.
