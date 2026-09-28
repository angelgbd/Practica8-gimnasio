import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export function createPrismaAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL debe apuntar a una base MySQL o MariaDB.");
  }

  const url = new URL(connectionString);
  if (url.protocol !== "mysql:") {
    throw new Error("DATABASE_URL debe usar el protocolo mysql://.");
  }

  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  if (!url.hostname || !database) {
    throw new Error(
      "DATABASE_URL debe incluir host y nombre de base de datos.",
    );
  }

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    connectionLimit: 5,
  });
}
