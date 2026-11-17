import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Link } from "../links/link.entity";

/**
 * One row per page load: the visit itself, its traffic source, and a hash that says "the same visitor as
 * that other row today" without saying who.
 *
 * There is no counter row to increment, for the reason `BlockEvent` gives: an insert cannot lose to a
 * read-modify-write race. Reads always start at one page and then group by day or by source, which is what
 * the two indexes cover; neither bounds the table, and nothing prunes it yet.
 */
@Entity("page_views")
@Index(["linkId", "createdAt"])
@Index(["linkId", "visitorHash"])
export class PageView {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  linkId!: string;

  @ManyToOne(() => Link, { onDelete: "CASCADE" })
  @JoinColumn({ name: "linkId" })
  link!: Link;

  /** Set when the address carried utm tags: the dashboard prefers them over any referrer. */
  @Column({ type: "varchar", nullable: true })
  utmSource!: string | null;

  @Column({ type: "varchar", nullable: true })
  utmMedium!: string | null;

  @Column({ type: "varchar", nullable: true })
  utmCampaign!: string | null;

  /** The external host the visitor came from, or nothing — a visit with no referrer is `direct`. */
  @Column({ type: "varchar", nullable: true })
  referrerHost!: string | null;

  /** The referrer was this site's own address: a real visit, but not one this page acquired. */
  @Column({ type: "boolean", default: false })
  referrerInternal!: boolean;

  /** A daily-rotating hash of address and user agent — the only visitor artefact stored anywhere. */
  @Column({ type: "varchar" })
  visitorHash!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
