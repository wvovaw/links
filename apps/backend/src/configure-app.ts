import type { INestApplication } from "@nestjs/common";

import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

/**
 * Everything `main.ts` does to the application except `listen()`. Shared with the test harness
 * (see `test/create-test-app.ts`) so e2e tests hit the same cookie parsing, CORS and validation
 * behaviour the running server has — a suite that skips the `ValidationPipe` passes requests the
 * server would reject.
 */
export function configureApp(app: INestApplication) {
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}
