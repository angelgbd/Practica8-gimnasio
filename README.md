<img width="811" height="802" alt="image" src="https://github.com/user-attachments/assets/19eb858b-faa9-4a80-8d21-8ea32618a221" />

# Gimnasio API — Código base (Semana 5)

API REST en NestJS para el gimnasio: `Clases`, `Horarios`, `Miembros` e `Inscripciones`, cada
módulo con dominio, DTOs e infraestructura separados (patrón repositorio + inyección por token).
Los repositorios usan Prisma ORM 7 con el adaptador MariaDB para guardar los datos en MySQL.

Este proyecto es el punto de partida de la Práctica 8 (Prisma) y la Práctica 9 (Blindar la API).

## Cómo correrlo

1. Copia `.env.example` a `.env` y configura `DATABASE_URL` para una base MySQL/MariaDB.
2. Instala dependencias, genera Prisma Client y prepara la base:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

El servidor levanta en `http://localhost:3000`. En `peticiones.http` está la batería completa de
peticiones (requiere la extensión "REST Client" de VS Code). Ejecútalas en orden sobre una base
desechable: las filas creadas se conservan en MySQL entre reinicios.

## Estructura

```
src/
  clases/        CRUD de clases del gimnasio
  horarios/      CRUD de horarios (día, hora, cupo, entrenador)
  miembros/      CRUD de miembros del gimnasio
  inscripciones/ inscribir a un miembro a un horario, con reglas de cupo y duplicados
  datos/         datos de arranque (seed) que usan Horarios y Miembros
```

Cada módulo sigue la misma forma: `dominio/` (entidades + interfaz del repositorio), `dto/`,
`infra/` (repositorio Prisma) y el token de inyección en `<módulo>.tokens.ts`.
