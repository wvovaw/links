import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
export class BlockEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  linkId!: string;

  @ManyToOne(() => Link, { onDelete: "CASCADE" })
  @JoinColumn({ name: "linkId" })
  link!: Link;

  @Column({ type: "varchar" })
  blockId!: string;

  @Column({ type: "varchar" })
  kind!: BlockEventKind;

  @CreateDateColumn()
  createdAt!: Date;
}
