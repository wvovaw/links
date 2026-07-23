import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RefreshSession } from "../auth/refresh-session.entity";
import { Link } from "../links/link.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: "text", nullable: true })
  avatarFileId!: string | null;

  @OneToMany(() => RefreshSession, session => session.user)
  refreshSessions!: RefreshSession[];

  @OneToMany(() => Link, link => link.owner)
  links!: Link[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
