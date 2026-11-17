import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `form_submissions` holds one row per accepted form submission, so a page's owner can read what visitors
 * sent. The foreign key cascades onto `links`: deleting a page takes its submissions with it, or the table
 * would keep the words of a page nothing can render.
 *
 * Hand-written from the generated migration, which creates the table and then rebuilds it through a
 * temporary one to attach the foreign key — a step an empty new table does not need. `payload` is `text`
 * because `simple-json` is stored as the JSON text class-transformer writes, not as a SQLite document.
 */
export class AddFormSubmissions1794772573246 implements MigrationInterface {
  name = "AddFormSubmissions1794772573246";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "form_submissions" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"linkId" varchar NOT NULL, ` +
        `"blockId" varchar NOT NULL, ` +
        `"kind" varchar NOT NULL, ` +
        `"payload" text NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `CONSTRAINT "FK_cd21e05fc3592d0120a99dc42f4" FOREIGN KEY ("linkId") ` +
        `REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_cd21e05fc3592d0120a99dc42f" ON "form_submissions" ("linkId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_cd21e05fc3592d0120a99dc42f"`);
    await queryRunner.query(`DROP TABLE "form_submissions"`);
  }
}
