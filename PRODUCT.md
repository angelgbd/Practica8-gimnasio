# Contexto del producto

## Qué ofrece

El proyecto contiene la API y el cliente web del gimnasio. Los miembros consultan los horarios publicados, reservan un lugar y revisan sus propias inscripciones.

## Personas y permisos

- Los miembros con una cuenta vinculada a un registro de miembro pueden inscribirse y consultar sus inscripciones.
- Entrenadores y administradores pueden iniciar sesión, pero no pueden usar el flujo de inscripción de miembros.
- La interfaz mejora la navegación; la API valida el JWT, el rol y la relación con el miembro antes de acceder a datos protegidos.

## Tareas principales

1. Consultar clase, día, hora, entrenador y lugares disponibles.
2. Iniciar sesión si se intenta abrir una página protegida o reservar un lugar.
3. Inscribirse a un horario y recibir el resultado de la API.
4. Consultar el historial propio y cerrar sesión.

## Restricciones del ejercicio

- Interfaz en español.
- API local predeterminada en `http://localhost:3000`.
- El cliente guarda la sesión existente y manda el JWT como `Authorization: Bearer <token>`.
- El backend determina `miembroId` desde el JWT; el cliente no lo envía.
