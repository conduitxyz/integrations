export type WebhookSecretError = WebhookSecretValueError;

export class WebhookSecretValueError extends Error {
  public type = "WebhookSecretValueError";
  public statusCode = 401;
}

export function isSecretError(error: unknown): error is WebhookSecretError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    ["WebhookSecretError"].includes((error as WebhookSecretError).type)
  );
}
