---
type: ticket
id: LINKS-010
title: "Backend: enforce an upload size limit on block images"
status: ready-for-agent
priority: medium
area: backend
created: 2026-11-13
updated: 2026-11-13
blocked_by: []
blocks: []
---

# LINKS-010 — Backend: enforce an upload size limit on block images

## What to build

Authoring of `POST /storage/images` and `POST /storage/avatars` is inconsistent: the avatar path
enforces a file-size limit, the block-image path enforces none, so an arbitrarily large file is
accepted and written to disk. Found while proving the wave 2 multer major.

Make both upload paths enforce a limit. Keep it a configuration value with a sane default, reject
oversized uploads with a client error (not a 500), and make sure a rejected upload leaves nothing on
disk.

## Acceptance criteria

- [ ] an upload above the limit is rejected with a 4xx status on both upload paths, and no file
      remains in the uploads directory afterwards
- [ ] an upload below the limit still succeeds on both paths, and the stored file is readable back
      through the storage endpoint
- [ ] the limit is configurable, with its variable documented next to the existing storage
      environment variables
- [ ] oversized and boundary-sized cases are covered by an automated check (the Bruno collection in
      `apps/backend/.bruno`, or a script wired into the repo if the collection cannot express a
      multipart fixture that large)
- [ ] `pnpm verify` green on the pinned runtime, working tree clean afterwards

## Notes

- The multer major landed in wave 2 (`LINKS-006`). Its limit handling rejects non-integer sizes, so
  keep the values integers.
- Client side: check whether the constructor's upload UI advertises a limit, so the message a user
  sees matches the server rule.
