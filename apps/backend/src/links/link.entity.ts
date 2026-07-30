import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { BlockImage } from "../storage/block-image.entity";
import { User } from "../users/user.entity";
import { LinkStatus } from "./link-status";

@Entity("links")
export class Link {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column("simple-json")
  blocks!: unknown[];

  @Column("simple-json")
  seo!: Record<string, unknown>;

  @Column()
  background!: string;

  @Column({ type: "text", default: LinkStatus.FRESH })
  status!: LinkStatus;

  @ManyToOne(() => User, (user) => user.links, { onDelete: "CASCADE" })
  owner!: User;

  @OneToMany(() => BlockImage, (image) => image.link)
  images!: BlockImage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
