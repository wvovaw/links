import type { FormSubmission } from "../types";

import { useApiClient } from "../client";

export interface LinkSubmissions {
  submissions: FormSubmission[];
  /**
   * True when the list could not be read at all — an unreachable API, or a session that has expired. It is
   * not the same answer as an empty list: "nobody wrote to you" and "we could not ask" are different facts,
   * and the owner reading their messages must not be told the wrong one.
   */
  failed: boolean;
}

/** The messages visitors left on one of a page's form blocks, newest first. */
export async function getLinkSubmissions(id: string, blockId: string, limit = 50): Promise<LinkSubmissions> {
  try {
    const api = useApiClient();
    const { submissions } = await api<{ submissions: FormSubmission[] }>(`/links/${id}/submissions`, {
      query: { blockId, limit },
    });

    return { submissions: submissions ?? [], failed: false };
  } catch {
    return { submissions: [], failed: true };
  }
}
