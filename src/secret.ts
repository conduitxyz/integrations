import { isSecretError } from "./errors.js";

export const SECRET_HEADER_NAME = "X-Conduit-Integration-Secret";

export function assertValidSecret(headerSecret: string, secret: string) {
  if (headerSecret !== secret) {
    throw new Error("Secret is invalid");
  }
}

export function isValidSecret(headerSecret: string, secret: string) {
  try {
    assertValidSecret(headerSecret, secret);
    return true;
  } catch (err) {
    if (isSecretError(err)) {
      return false;
    }
    throw err;
  }
}
