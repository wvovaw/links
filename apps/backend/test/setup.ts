import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Test environment. `setupFiles` run before the test file imports anything, which matters:
 * `databaseConfig` and `LocalStorageService` read `process.env` at module load, so these values
 * must be in place first.
 *
 * - `DATABASE_PATH=:memory:` gives every test file a private database. `AppModule` runs pending
 *   migrations on boot, so each file starts from the real schema rather than a synchronised one.
 * - Uploads go to a throwaway directory instead of `apps/backend/uploads`.
 */
process.env.NODE_ENV = "test";
process.env.DATABASE_PATH = ":memory:";
process.env.JWT_SECRET ??= "test-secret";

const uploads = mkdtempSync(join(tmpdir(), "links-test-uploads-"));

process.env.UPLOADS_PATH = join(uploads, "avatars");
process.env.IMAGES_PATH = join(uploads, "images");
