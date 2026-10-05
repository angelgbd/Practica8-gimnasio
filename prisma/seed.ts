import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generado/prisma/client";
import { createPrismaAdapter } from "../src/prisma/prisma.adapter";

const prisma = new PrismaClient({ adapter: createPrismaAdapter() });

async function main(): Promise<void> {
  await prisma.usuario.deleteMany();

  await prisma.clase.upsert({
    where: { id: 1 },
    create: { id: 1, nombre: "Yoga", descripcion: "" },
    update: { nombre: "Yoga", descripcion: "" },
  });
  await prisma.clase.upsert({
    where: { id: 2 },
    create: { id: 2, nombre: "Spinning", descripcion: "" },
    update: { nombre: "Spinning", descripcion: "" },
  });

  const horarios = [
    {
      id: 1,
      claseId: 1,
      dia: "lunes",
      horaInicio: "07:00",
      cupoMaximo: 2,
      entrenador: "Ana Robles",
    },
    {
      id: 2,
      claseId: 1,
      dia: "miercoles",
      horaInicio: "07:00",
      cupoMaximo: 3,
      entrenador: "Ana Robles",
    },
    {
      id: 3,
      claseId: 2,
      dia: "martes",
      horaInicio: "19:00",
      cupoMaximo: 4,
      entrenador: "Luis Fierro",
    },
  ];
  for (const horario of horarios) {
    const { id, ...datos } = horario;
    await prisma.horario.upsert({
      where: { id },
      create: horario,
      update: datos,
    });
  }

  const miembros = [
    {
      id: 1,
      nombre: "Karla Duarte",
      correo: "karla@itson.mx",
      membresia: "premium",
      activo: true,
    },
    {
      id: 2,
      nombre: "Omar Valdez",
      correo: "omar@itson.mx",
      membresia: "plus",
      activo: true,
    },
    {
      id: 3,
      nombre: "Sofia Ibarra",
      correo: "sofia@itson.mx",
      membresia: "basica",
      activo: true,
    },
  ];
  for (const miembro of miembros) {
    const { id, ...datos } = miembro;
    await prisma.miembro.upsert({
      where: { id },
      create: miembro,
      update: datos,
    });
  }

  const passwordHash = await bcrypt.hash("gimnasio2026", 10);
  await prisma.usuario.createMany({
    data: [
      {
        correo: "karla@itson.mx",
        passwordHash,
        rol: "miembro",
        miembroId: 1,
      },
      {
        correo: "ana@itson.mx",
        passwordHash,
        rol: "entrenador",
      },
      {
        correo: "admin@itson.mx",
        passwordHash,
        rol: "admin",
      },
    ],
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
