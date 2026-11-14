import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `links.theme` stores the validated page theme as JSON. Nullable on purpose: a page published before
 * themes existed has `theme: null` and keeps rendering from its raw `background` CSS.
 *
 * Hand-written rather than the generated table rebuild: SQLite can add the column in place, so the
 * existing rows, unique constraint and foreign key are left untouched.
 */
export class AddLinkTheme1794670641529 implements MigrationInterface {
  name = "AddLinkTheme1794670641529";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" ADD COLUMN "theme" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "theme"`);
  }
}
