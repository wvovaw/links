import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { User } from "../users/user.entity";

export const uploadedFileKinds = ["image", "asset", "avatar"] as const;
export type UploadedFileKind = (typeof uploadedFileKinds)[number];

/**
 * One row per uploaded file, written by the route that stored its bytes. The file id is the primary key: a
 * stored file has exactly one uploader, and the id is the name it is served under.
 *
 * This table is what authorises a file. Before it existed nothing recorded the uploader, so a file id — and
 * file ids are visible on a published page — was enough to attach another owner's file to your own page and
 * then delete their bytes. A page may now claim only what its owner uploaded, and only the uploader deletes.
 *
 * Rows cascade with the user, so an account that is deleted cannot leave its files attributed to nobody.
 */
@Entity("uploaded_files")
export class UploadedFile {
  @PrimaryColumn({ type: "varchar" })
  fileId!: string;

  /** Every claim and every delete asks who uploaded one file or which files a caller uploaded. */
  @Index()
  @Column({ type: "varchar" })
  ownerId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @Column({ type: "varchar" })
  kind!: UploadedFileKind;

  @CreateDateColumn()
  createdAt!: Date;
}
