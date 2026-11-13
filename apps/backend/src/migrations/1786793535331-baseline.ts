import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Baseline schema: users, refresh sessions, links and block images as they
 * stood when the backend moved from `synchronize: true` to migrations.
 */
export class Baseline1786793535331 implements MigrationInterface {
  name = "Baseline1786793535331";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"email" varchar NOT NULL, ` +
        `"name" varchar NOT NULL, ` +
        `"passwordHash" varchar NOT NULL, ` +
        `"avatarFileId" text, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"updatedAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")` +
        `)`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_sessions" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"tokenHash" varchar NOT NULL, ` +
        `"expiresAt" datetime NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"userId" varchar, ` +
        `CONSTRAINT "FK_78744bff965517952df6c02da76" FOREIGN KEY ("userId") ` +
        `REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
    await queryRunner.query(
      `CREATE TABLE "links" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"slug" varchar NOT NULL, ` +
        `"title" varchar NOT NULL, ` +
        `"blocks" text NOT NULL, ` +
        `"seo" text NOT NULL, ` +
        `"background" varchar NOT NULL, ` +
        `"status" text NOT NULL DEFAULT ('FRESH'), ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"updatedAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"ownerId" varchar, ` +
        `CONSTRAINT "UQ_54ebf5dec4e16cbf8f22d44caec" UNIQUE ("slug"), ` +
        `CONSTRAINT "FK_a043e1afce454249f5076c1c2ad" FOREIGN KEY ("ownerId") ` +
        `REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
    await queryRunner.query(
      `CREATE TABLE "block_images" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"fileId" varchar NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"linkId" varchar, ` +
        `CONSTRAINT "FK_26fb7158004f0569e48bdfa85df" FOREIGN KEY ("linkId") ` +
        `REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "block_images"`);
    await queryRunner.query(`DROP TABLE "links"`);
    await queryRunner.query(`DROP TABLE "refresh_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
