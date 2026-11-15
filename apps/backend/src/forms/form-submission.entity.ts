import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Link } from "../links/link.entity";

export const formSubmissionKinds = ["contact", "subscribe"] as const;
export type FormSubmissionKind = (typeof formSubmissionKinds)[number];

/** What a form block sends: the fields its page asked for, and nothing else. */
export interface FormSubmissionPayload {
  email: string;
  name?: string;
  message?: string;
}

/**
 * One row per accepted submission. The payload is the visitor's own words held as JSON rather than a
 * column each, because the fields a form asks for differ per block: an email capture stores an address,
 * a contact form stores a name and a message too.
 *
 * The address is what the owner asked the visitor for; nothing else about them is kept — no ip, no user
 * agent, no cookie. The row says which block of which page was filled in, with what, and when.
 */
@Entity("form_submissions")
export class FormSubmission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** The owner reads one page at a time, so the page's id is what an index is spent on. */
  @Index()
  @Column({ type: "varchar" })
  linkId!: string;

  @ManyToOne(() => Link, { onDelete: "CASCADE" })
  @JoinColumn({ name: "linkId" })
  link!: Link;

  @Column({ type: "varchar" })
  blockId!: string;

  @Column({ type: "varchar" })
  kind!: FormSubmissionKind;

  @Column({ type: "simple-json" })
  payload!: FormSubmissionPayload;

  @CreateDateColumn()
  createdAt!: Date;
}
