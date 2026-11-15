import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `block_assets` tracks the video, audio and pdf files a page holds, so that deleting a link takes
 * them with it: the foreign key cascades onto `links`, exactly like `block_images`.
 *
 * Hand-written from the generated migration, which creates the table and then rebuilds it through a
 * temporary one to attach the foreign key — a step an empty new table does not need.
 */
export class AddBlockAssets1794767625373 implements MigrationInterface {
  name = "AddBlockAssets1794767625373";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block_assets" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"fileId" varchar NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `"linkId" varchar, ` +
        `CONSTRAINT "FK_95fb565204bbbe90dfe6c5da3c4" FOREIGN KEY ("linkId") ` +
        `REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "block_assets"`);
  }
}
