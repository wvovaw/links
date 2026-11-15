import type { FormSubmission } from "../types";

import { useApiClient } from "../client";

/**
 * The messages visitors left on one of a page's form blocks, newest first. An unreachable API, an expired
 * session and a page with no submissions all read as "nothing yet": the panel lists nothing rather than
 * showing an error over a page its owner is editing.
 */
export async function getLinkSubmissions(id: string, blockId: string, limit = 50): Promise<FormSubmission[]> {
  try {
    const api = useApiClient();
    const { submissions } = await api<{ submissions: FormSubmission[] }>(`/links/${id}/submissions`, {
      query: { blockId, limit },
    });

    return submissions ?? [];
  } catch {
    return [];
  }
}
