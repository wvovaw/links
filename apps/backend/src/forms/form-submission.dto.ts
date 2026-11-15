import type { FormSubmission, FormSubmissionKind, FormSubmissionPayload } from "./form-submission.entity";

export interface FormSubmissionDto {
  id: string;
  blockId: string;
  kind: FormSubmissionKind;
  payload: FormSubmissionPayload;
  createdAt: Date;
}

export function toSubmissionDto(submission: FormSubmission): FormSubmissionDto {
  return {
    id: submission.id,
    blockId: submission.blockId,
    kind: submission.kind,
    payload: submission.payload,
    createdAt: submission.createdAt,
  };
}
