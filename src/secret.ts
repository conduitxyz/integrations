import {
  isSecretError,
  WebhookSecretValueError,
  WebhookSignatureValueError,
} from "./errors.js";

/**
 * Header containing the raw integration secret.
 * Sent when no signature secret is configured for the integration.
 */
export const SECRET_HEADER_NAME = "X-Conduit-Integration-Secret";

/**
 * Header containing the integration secret.
 * Sent instead of `X-Conduit-Integration-Secret` when a signature secret is
 * configured for the integration.
 */
export const API_KEY_HEADER_NAME = "X-Conduit-Integration-Api-Key";

/**
 * Header containing the HMAC-SHA256 signature of the raw request body,
 * hex-encoded and prefixed with `sha256=`.
 * Sent when a signature secret is configured for the integration.
 */
export const SIGNATURE_HEADER_NAME = "X-Conduit-Integration-Signature-256";

export function assertValidSecret(headerSecret: string, secret: string) {
  if (headerSecret !== secret) {
    throw new WebhookSecretValueError("Secret is invalid");
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

async function hmacSha256Hex(secret: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validates the `X-Conduit-Integration-Signature-256` header against the raw
 * request body. The header value is `sha256=` followed by the hex-encoded
 * HMAC-SHA256 of the body, keyed with your signature secret.
 *
 * Pass the raw request body exactly as received, before any JSON parsing.
 */
export async function assertValidSignature(
  headerSignature: string,
  rawBody: string,
  signatureSecret: string
) {
  const expected = `sha256=${await hmacSha256Hex(signatureSecret, rawBody)}`;
  if (!timingSafeEqual(headerSignature, expected)) {
    throw new WebhookSignatureValueError("Signature is invalid");
  }
}

export async function isValidSignature(
  headerSignature: string,
  rawBody: string,
  signatureSecret: string
) {
  try {
    await assertValidSignature(headerSignature, rawBody, signatureSecret);
    return true;
  } catch (err) {
    if (isSecretError(err)) {
      return false;
    }
    throw err;
  }
}

function timingSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= (aBytes[i] as number) ^ (bBytes[i] as number);
  }
  return result === 0;
}
