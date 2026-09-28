import "dotenv/config";
import { randomUUID } from "node:crypto";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DomainErrorFilter } from "./common/domain-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((_request, response, next) => {
    response.setHeader("X-Request-Id", randomUUID());
    next();
  });
  app.enableCors({
    origin: ["http://localhost:4200", "http://localhost:5173"],
    exposedHeaders: ["Location", "X-Request-Id"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
