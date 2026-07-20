---
"@conduitxyz/integrations": minor
---

Sync event and response types with the current IntegrationEvent proto and webhook behavior:

- Add `arguments` to `INSTALLED` events (configuration inputs submitted by the customer)
- Add `InstallationArtifact` type and `artifacts` to `IntegrationEventResponse`
- Mark `logo_url`, `icon_url`, `brand_color`, and `private` as optional; the API omits default values from the JSON payload
- Add `API_KEY_HEADER_NAME` and `SIGNATURE_HEADER_NAME` constants plus `isValidSignature`/`assertValidSignature` helpers for HMAC-SHA256 (`X-Conduit-Integration-Signature-256`) webhook verification
- Fix `isValidSecret` throwing instead of returning `false` on an invalid secret: `assertValidSecret` now throws `WebhookSecretValueError`, and `isSecretError` matches the correct error `type` values
