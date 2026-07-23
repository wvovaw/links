import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity("refresh_sessions")
export class RefreshSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tokenHash!: string;

  @Column()
  expiresAt!: Date;

  @ManyToOne(() => User, user => user.refreshSessions, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
