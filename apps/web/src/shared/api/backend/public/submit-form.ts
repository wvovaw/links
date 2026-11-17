import { useApiClient } from "../client";

export type SubmissionKind = "contact" | "subscribe";

export interface SubmitFormInput {
  slug: string;
  blockId: string;
  kind: SubmissionKind;
  email: string;
  name?: string;
  message?: string;
  /**
   * The honeypot. A person never fills it in; a robot that does is answered as if the submission were
   * stored, so nothing tells it the trap it walked into.
   *
   * It is called `company` on purpose: password managers autofill a `website` field, and a real visitor's
   * message would then be dropped while they are thanked for sending it.
   */
  company?: string;
}

/**
 * Stores one filled-in form on a published page. It resolves when the submission is stored and throws
 * what the API answered, so the form can say whether it was saved rather than assume it.
 *
 * Only the DTO's fields are sent. The slug is a URL segment, and the endpoint runs `whitelist` +
 * `forbidNonWhitelisted`: a body that repeats it answers 400 and the visitor's message is lost. An optional
 * field nobody filled in is left out rather than sent as `undefined`.
 */
export async function submitForm(input: SubmitFormInput): Promise<void> {
  const api = useApiClient();
  const { slug, blockId, kind, email, name, message, company } = input;

  const body = {
    blockId,
    kind,
    email,
    ...(name !== undefined && { name }),
    ...(message !== undefined && { message }),
    ...(company !== undefined && { company }),
  };

  await api(`/public/links/${slug}/submissions`, { method: "POST", body });
}

/** The status a failed submission came back with, or `undefined` when the request never reached the API. */
export function submissionStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown };
  if (typeof status === "number") return status;

  return typeof statusCode === "number" ? statusCode : undefined;
}
