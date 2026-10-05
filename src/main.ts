import "dotenv/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { DomainErrorFilter } from "./common/domain-error.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { SobreInterceptor } from "./common/interceptors/sobre.interceptor";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173"],
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
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new SobreInterceptor(),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("API del Gimnasio")
    .setVersion("1.0")
    .addBearerAuth()
    .addSecurityRequirements("bearer")
    .build();
  const documento = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, documento);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
