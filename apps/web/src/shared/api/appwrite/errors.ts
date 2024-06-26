const REQUEST_ERRORS = {
  user_already_exists: "A user with the same email or/and username already exists.",
  user_invalid_credentials: "Invalid credentials. Please check email and password.",
  user_unauthorized: "You are not authorized to perform that action.",
  document_not_found: "Requested document not found.",
  unknown: "Unknown error occured. Please try again.",
} as const;

type RequestErrorType = keyof typeof REQUEST_ERRORS;

export function getErrorMessage(type: string) {
  return REQUEST_ERRORS[type as RequestErrorType] || REQUEST_ERRORS.unknown;
}
