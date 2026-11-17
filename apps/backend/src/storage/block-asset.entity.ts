import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Link } from "../links/link.entity";

@Entity("block_assets")
export class BlockAsset {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fileId!: string;

  @ManyToOne(() => Link, (link) => link.assets, { onDelete: "CASCADE" })
  link!: Link;

  @CreateDateColumn()
  createdAt!: Date;
}
