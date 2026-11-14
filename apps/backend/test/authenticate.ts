import type { INestApplication } from "@nestjs/common";

import { randomUUID } from "node:crypto";
import request from "supertest";

const password = "test-password-1";

/**
 * Registers a fresh account, logs in and returns an agent holding the `access_token` cookie, so a
 * suite can talk to the guarded endpoints without repeating the auth round trip. Every call gets a
 * unique email (and username): tests share nothing, so they may authenticate as often as they like.
 *
 * Pass `email` to control the address when a test needs a second session for the same account.
 */
export async function authenticate(app: INestApplication, email?: string): Promise<ReturnType<typeof request.agent>> {
  const credentials = {
    email: email ?? `user-${randomUUID()}@example.com`,
    username: `user-${randomUUID()}`,
    password,
  };

  const agent = request.agent(app.getHttpServer());

  await agent.post("/auth/register").send(credentials).expect(201);
  await agent.post("/auth/login").send({ email: credentials.email, password }).expect(200);

  return agent;
}
