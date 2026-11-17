import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * A click gains the same traffic source a page view carries, so "clicks by source" is one grouped read of
 * this table rather than a join to `page_views`. `visitorHash` is nullable here and not on `page_views`
 * because this table already has history: a click recorded before today keeps counting as a click and as no
 * distinct clicker, and a hash is never invented for it.
 *
 * The two composite indexes are what the reads start from — a page filtered by time, and its distinct
 * clickers. The single-column `linkId` index stays: the entity still declares it, and it is the index the
 * oldest reads were written against.
 *
 * Hand-written from the generated migration, which rebuilds the whole table through a temporary one to add
 * nullable columns. `ADD COLUMN` does not need that, and not copying every row of a growing table is the
 * reason to prefer it.
 */
export class AddBlockEventSource1794904542648 implements MigrationInterface {
  name = "AddBlockEventSource1794904542648";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "utmSource" varchar`);
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "utmMedium" varchar`);
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "utmCampaign" varchar`);
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "referrerHost" varchar`);
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "referrerInternal" boolean NOT NULL DEFAULT (0)`);
    await queryRunner.query(`ALTER TABLE "block_events" ADD COLUMN "visitorHash" varchar`);

    await queryRunner.query(`CREATE INDEX "IDX_1c0ac1d2e835a7b6babe5a94af" ON "block_events" ("linkId", "createdAt")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_8ab78e1f3532ac3f676626a9ca" ON "block_events" ("linkId", "visitorHash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8ab78e1f3532ac3f676626a9ca"`);
    await queryRunner.query(`DROP INDEX "IDX_1c0ac1d2e835a7b6babe5a94af"`);

    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "visitorHash"`);
    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "referrerInternal"`);
    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "referrerHost"`);
    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "utmCampaign"`);
    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "utmMedium"`);
    await queryRunner.query(`ALTER TABLE "block_events" DROP COLUMN "utmSource"`);
  }
}
