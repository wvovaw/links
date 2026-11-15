import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `block_events` holds one row per click or view a public page reports, so the owner can see what a
 * block earns. The foreign key cascades onto `links`: deleting a page takes its events with it, or the
 * table would grow with rows nothing can read.
 *
 * Hand-written from the generated migration, which creates the table and then rebuilds it through a
 * temporary one to attach the foreign key — a step an empty new table does not need.
 */
export class AddBlockEvents1794770895055 implements MigrationInterface {
  name = "AddBlockEvents1794770895055";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block_events" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"linkId" varchar NOT NULL, ` +
        `"blockId" varchar NOT NULL, ` +
        `"kind" varchar NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `CONSTRAINT "FK_d8396b703168a13811a6793d796" FOREIGN KEY ("linkId") ` +
        `REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "block_events"`);
  }
}
