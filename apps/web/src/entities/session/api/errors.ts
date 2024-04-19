const REQUEST_ERRORS = {
  user_already_exists: "A user with the same email or/and username already exists.",
  unknown: "Unknown error occured. Please try again.",
} as const;

type RequestErrorType = keyof typeof REQUEST_ERRORS;

export function getErrorMessage(type: string) {
  return REQUEST_ERRORS[type as RequestErrorType] || REQUEST_ERRORS.unknown;
}