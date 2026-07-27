import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Link } from "../links/link.entity";

@Entity("block_images")
export class BlockImage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fileId!: string;

  @ManyToOne(() => Link, link => link.images, { onDelete: "CASCADE" })
  link!: Link;

  @CreateDateColumn()
  createdAt!: Date;
}
