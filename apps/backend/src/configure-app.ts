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
  /*
    Exactly one hop in front (nginx/traefik). Without it `req.ip` is the proxy's address for every visitor,
    the analytics visitor hash collapses to a single value, and every page reports one unique visitor no
    matter how much traffic it gets.
  */
  app.getHttpAdapter().getInstance().set("trust proxy", 1);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
    /* A beacon posts a json blob, which is not a simple request: without this every click preflights. */
    maxAge: 600,
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
