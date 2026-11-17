import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Link } from "../links/link.entity";

export const blockEventKinds = ["click", "view"] as const;
export type BlockEventKind = (typeof blockEventKinds)[number];

/**
 * One row per accepted event. There is no counter row to increment, so two visitors clicking the same
 * block in the same second both land: an insert cannot lose to a read-modify-write race the way an
 * `UPDATE ... SET clicks = clicks + 1` on a shared row can.
 *
 * Nothing here identifies a visitor: the row says which block of which page saw which kind of event and
 * when, and nothing else.
 */
@Entity("block_events")
@Index(["linkId", "createdAt"])
@Index(["linkId", "visitorHash"])
export class BlockEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Every read of this table starts at one page, so the aggregation is an index scan, not a table scan. */
  @Index()
  @Column({ type: "varchar" })
  linkId!: string;

  @ManyToOne(() => Link, { onDelete: "CASCADE" })
  @JoinColumn({ name: "linkId" })
  link!: Link;

  @Column({ type: "varchar" })
  blockId!: string;

  @Column({ type: "varchar" })
  kind!: BlockEventKind;

  /** Set when the address carried utm tags: the dashboard prefers them over any referrer. */
  @Column({ type: "varchar", nullable: true })
  utmSource!: string | null;

  @Column({ type: "varchar", nullable: true })
  utmMedium!: string | null;

  @Column({ type: "varchar", nullable: true })
  utmCampaign!: string | null;

  /** The external host the visitor came from, or nothing — a click with no referrer is `direct`. */
  @Column({ type: "varchar", nullable: true })
  referrerHost!: string | null;

  /** The referrer was this site's own address: a real click, but not one this page acquired. */
  @Column({ type: "boolean", default: false })
  referrerInternal!: boolean;

  /**
   * Nullable, unlike the same column on `page_views`: this table has history. A click recorded before the
   * source existed counts as a click and as zero distinct clickers, and no hash is invented for it.
   */
  @Column({ type: "varchar", nullable: true })
  visitorHash!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
