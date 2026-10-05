<img width="811" height="802" alt="image" src="https://github.com/user-attachments/assets/19eb858b-faa9-4a80-8d21-8ea32618a221" />

# Gimnasio API — Código base (Semana 5)

API REST en NestJS para el gimnasio: `Clases`, `Horarios`, `Miembros` e `Inscripciones`, cada
módulo con dominio, DTOs e infraestructura separados (patrón repositorio + inyección por token).
Los repositorios usan Prisma ORM 7 con el adaptador MariaDB para guardar los datos en MySQL.

Este proyecto es el punto de partida de la Práctica 8 (Prisma) y la Práctica 9 (Blindar la API).

## Cómo correrlo

1. Copia `.env.example` a `.env` y configura `DATABASE_URL` para una base MySQL/MariaDB.
2. Sustituye `JWT_SECRET` por un secreto aleatorio de al menos 32 caracteres. `.env` está ignorado por Git; no publiques ese valor.
3. Instala dependencias, genera Prisma Client y prepara la base:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

El servidor levanta en `http://localhost:3000` y Swagger está en `http://localhost:3000/docs`.
Las respuestas exitosas usan `{ data, meta }`; las respuestas de error mantienen el formato del filtro o de Nest.

Las cuentas de prueba son `karla@itson.mx`, `ana@itson.mx` y `admin@itson.mx`; las tres usan
`gimnasio2026`. Inicia sesión en `POST /auth/login` y manda el valor `data.access_token` como
`Authorization: Bearer <token>`. El seed elimina y recrea solo las filas de usuarios.

En `peticiones.http` está la batería de peticiones (requiere la extensión REST Client de VS Code).
Ejecuta primero los tres logins nombrados para que las solicitudes protegidas puedan reutilizar sus
tokens; después corre los ejemplos en orden sobre una base desechable.

Las consultas GET de clases y horarios, el inicio de la API y las rutas de login/registro son públicas.
Las demás rutas requieren JWT. Como material didáctico, el registro acepta `rol` y `miembroId` desde
el cuerpo: eso permite autoasignar el rol admin, así que no se debe usar este comportamiento en
producción.

## Estructura

```
src/
  auth/          registro, login, estrategia Passport y guard JWT
  clases/        CRUD de clases del gimnasio
  horarios/      CRUD de horarios (día, hora, cupo, entrenador)
  miembros/      CRUD de miembros del gimnasio
  inscripciones/ inscribir a un miembro a un horario, con reglas de cupo y duplicados
  common/        middleware de request-id, filtros e interceptores globales
  prisma/        PrismaService y módulo global
prisma/          esquema, migraciones y seed
evidencias/      diagrama del flujo JWT
```

Cada módulo sigue la misma forma: `dominio/` (entidades + interfaz del repositorio), `dto/`,
`infra/` (repositorio Prisma) y el token de inyección en `<módulo>.tokens.ts`.

## Respuestas — Parte 1

**¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?**

No cambió ninguna línea del Service ni del Controller. El proveedor del módulo pasó a usar el
repositorio Prisma; el import del DTO en el Controller es de valor para permitir la validación en
ejecución.

**¿Por qué InscripcionesService no tuvo que cambiar sus reglas de cupo y duplicados?**

InscripcionesService conserva las reglas porque sigue usando el mismo contrato de repositorio; solo
cambió dónde se leen y guardan los datos.

**¿Por qué una interfaz no puede validar nada en tiempo de ejecución?**

TypeScript elimina las interfaces al compilar. Las clases de DTO sí existen en ejecución y aportan
metadatos que `class-validator` puede inspeccionar.

**¿Qué código de estado responde la validación y qué trae en el cuerpo?**

Los dos casos responden 400. El cuerpo mal formado produjo `{"message":["horarioId must be an integer number","miembroId must be an integer number"],"error":"Bad Request","statusCode":400}`. La propiedad extra produjo `{"message":["property campoSorpresa should not exist"],"error":"Bad Request","statusCode":400}`. Para rechazar campos desconocidos, `forbidNonWhitelisted` debe acompañarse de `whitelist`.

**¿Cuántas líneas quedó más corto el controlador de Inscripciones?**

El controlador de Inscripciones tiene 26 líneas menos.

**Si la respuesta llega con los dos orígenes, ¿quién bloquea realmente y a quién protege CORS?**

CORS lo aplica el navegador: impide que el JavaScript de un origen no permitido lea la respuesta. No
impide por sí solo que un cliente directo envíe la petición; el servidor puede responder igualmente.

## Respuestas — Parte 2

**¿Por qué guardar `passwordHash` y no la contraseña?**

Se almacena un hash no reversible, nunca la contraseña en texto plano. En el login se compara la
contraseña recibida con el hash mediante bcrypt.

**¿Por qué las credenciales inválidas devuelven el mismo error?**

Usar el mismo 401 para correo inexistente y contraseña incorrecta evita revelar qué cuentas están
registradas mediante intentos de login.

**¿Qué aporta la firma JWT si el payload se puede leer?**

El payload está codificado, no cifrado: se puede leer. La firma permite detectar cambios y verificar
que lo emitió quien posee el secreto; alterar el payload invalida la firma.

**¿Por qué proteger por defecto y declarar rutas públicas explícitamente?**

Así una ruta nueva queda protegida automáticamente. Solo las rutas declaradas públicas quedan
accesibles sin token, reduciendo el riesgo de olvidar aplicar el guard.

**¿Cuál es la diferencia entre 401 y 403?**

401 indica que falta una autenticación válida. 403 indica que la identidad sí se autenticó, pero no
tiene permiso para esa acción; por ejemplo, un miembro intenta inscribir a otro miembro.

**¿Por qué no cambió AuthService al pasar usuarios de memoria a Prisma?**

AuthService depende del contrato `UsuarioRepository`, no de la implementación concreta. El módulo
de autenticación cambió el proveedor enlazado al token de inyección para usar `UsuarioPrismaRepository`.
