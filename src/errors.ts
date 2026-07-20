export type WebhookSecretError =
  | WebhookSecretValueError
  | WebhookSignatureValueError;

export class WebhookSecretValueError extends Error {
  public type = "WebhookSecretValueError";
  public statusCode = 401;
}

export class WebhookSignatureValueError extends Error {
  public type = "WebhookSignatureValueError";
  public statusCode = 401;
}

export function isSecretError(error: unknown): error is WebhookSecretError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    ["WebhookSecretValueError", "WebhookSignatureValueError"].includes(
      (error as WebhookSecretError).type
    )
  );
}
