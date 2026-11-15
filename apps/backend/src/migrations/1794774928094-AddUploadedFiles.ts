import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `uploaded_files` records who uploaded each stored file. Until this table existed nothing did: a file id —
 * and file ids are visible on a published page — could be attached to anyone's page and then deleted through
 * it, taking the real owner's bytes with it. Claims and deletes now resolve through this row.
 *
 * The foreign key cascades onto `users`: deleting an account takes its records, so no file is left attributed
 * to a user that no longer exists. Files uploaded before this migration have no row and stay unattributed;
 * the read paths treat that as "nobody can newly claim it, nobody can delete it by id" rather than as an error.
 *
 * Hand-written from the generated migration, which creates the table and rebuilds it through a temporary one
 * to attach the foreign key — a step an empty new table does not need.
 */
export class AddUploadedFiles1794774928094 implements MigrationInterface {
  name = "AddUploadedFiles1794774928094";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "uploaded_files" (` +
        `"fileId" varchar PRIMARY KEY NOT NULL, ` +
        `"ownerId" varchar NOT NULL, ` +
        `"kind" varchar NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `CONSTRAINT "FK_322adf90731a42dcba925842230" FOREIGN KEY ("ownerId") ` +
        `REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_322adf90731a42dcba92584223" ON "uploaded_files" ("ownerId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_322adf90731a42dcba92584223"`);
    await queryRunner.query(`DROP TABLE "uploaded_files"`);
  }
}
