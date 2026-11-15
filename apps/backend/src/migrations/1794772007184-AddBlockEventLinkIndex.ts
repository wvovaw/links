import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `block_events` is read one page at a time: the owner's stats query filters `linkId` and groups `blockId`,
 * so the page's id is indexed. Without it every owner request scans the events of every page on the site.
 *
 * The index makes those reads cheap; it does not bound the table. Rows grow with real blocks times traffic
 * and nothing prunes them yet — retention is a separate decision, not something this migration pretends to
 * solve.
 */
export class AddBlockEventLinkIndex1794772007184 implements MigrationInterface {
  name = "AddBlockEventLinkIndex1794772007184";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_d8396b703168a13811a6793d79" ON "block_events" ("linkId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_d8396b703168a13811a6793d79"`);
  }
}
