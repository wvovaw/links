import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * `page_views` holds one row per page load, so the owner can see how many times a page was opened, by how
 * many distinct visitors, and where they came from. The foreign key cascades onto `links`: deleting a page
 * takes its visits with it, or the table would grow with rows nothing can read.
 *
 * Neither index bounds the table; they are what the reads start from — a page filtered by time, and the
 * distinct-visitor count within one page. Hands off retention: nothing prunes this table yet.
 *
 * Hand-written from the generated migration, which creates the table and then rebuilds it through a
 * temporary one to attach the foreign key — a step an empty new table does not need.
 */
export class AddPageViews1794904386604 implements MigrationInterface {
  name = "AddPageViews1794904386604";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "page_views" (` +
        `"id" varchar PRIMARY KEY NOT NULL, ` +
        `"linkId" varchar NOT NULL, ` +
        `"utmSource" varchar, ` +
        `"utmMedium" varchar, ` +
        `"utmCampaign" varchar, ` +
        `"referrerHost" varchar, ` +
        `"referrerInternal" boolean NOT NULL DEFAULT (0), ` +
        `"visitorHash" varchar NOT NULL, ` +
        `"createdAt" datetime NOT NULL DEFAULT (datetime('now')), ` +
        `CONSTRAINT "FK_e01add852de05aa2fe8f1d6ab65" FOREIGN KEY ("linkId") ` +
        `REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` +
        `)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_90d38dd6a344079fd2be2476b8" ON "page_views" ("linkId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX "IDX_80bb1de0a539ebac33de1ab680" ON "page_views" ("linkId", "visitorHash")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "page_views"`);
  }
}
