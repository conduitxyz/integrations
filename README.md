# @conduitxyz/integrations

[![npm version](https://img.shields.io/npm/v/@conduitxyz/integrations)](https://www.npmjs.com/package/@conduitxyz/integrations)
[![npm downloads](https://img.shields.io/npm/dm/@conduitxyz/integrations)](https://www.npmjs.com/package/@conduitxyz/integrations)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@conduitxyz/integrations)](https://bundlephobia.com/package/@conduitxyz/integrations)
[![types](https://img.shields.io/npm/types/@conduitxyz/integrations)](https://www.npmjs.com/package/@conduitxyz/integrations)
[![CI](https://github.com/conduitxyz/integrations/actions/workflows/main.yml/badge.svg)](https://github.com/conduitxyz/integrations/actions/workflows/main.yml)
[![license](https://img.shields.io/npm/l/@conduitxyz/integrations)](https://www.npmjs.com/package/@conduitxyz/integrations)

TypeScript SDK for building [Conduit native integrations](https://docs.conduit.xyz/chains/native-integrations).

When a chain admin installs your integration from the Conduit Marketplace,
Conduit sends webhook events to your service. This SDK gives you:

- **Typed webhook events** — `IntegrationEvent` is a discriminated union
  narrowed by the `event` field (`INSTALLED`, `UNINSTALLED`,
  `NETWORK_DELETED`)
- **Type-safe responses** — `constructIntegrationEventResponse` validates
  status-specific fields at compile time
- **Request verification** — helpers for both authentication modes: the
  integration secret header and HMAC-SHA256 signatures

See the [Native Integrations documentation](https://docs.conduit.xyz/chains/native-integrations)
for the full integration lifecycle, payload reference, and a deployable
Cloudflare Worker example.

## Installation

```bash
npm install @conduitxyz/integrations
```

## Usage

Handle webhook events in any runtime with standard `Request`/`Response`
(Cloudflare Workers, Bun, Deno, Node.js 18+ with a fetch adapter):

```typescript
import {
  SECRET_HEADER_NAME,
  isValidSecret,
  constructIntegrationEventResponse,
  type IntegrationEvent,
} from "@conduitxyz/integrations";

export async function handleWebhook(request: Request): Promise<Response> {
  // Verify the request came from Conduit.
  const headerSecret = request.headers.get(SECRET_HEADER_NAME) ?? "";
  if (!isValidSecret(headerSecret, process.env.CONDUIT_INTEGRATION_SECRET!)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = (await request.json()) as IntegrationEvent;

  switch (event.event) {
    case "INSTALLED": {
      // event is narrowed: chain_id, rpc, contracts, arguments, and so on
      // are available here. Start indexing, deploy contracts, etc.
      return Response.json(
        constructIntegrationEventResponse({
          id: event.id,
          status: "INSTALLED",
          manage_integration_link: `https://example.com/manage/${event.id}`,
        })
      );
    }
    case "UNINSTALLED":
    case "NETWORK_DELETED": {
      // Clean up resources for event.id.
      return Response.json(
        constructIntegrationEventResponse({
          id: event.id,
          status: "NOT_INSTALLED",
        })
      );
    }
    default:
      return new Response("OK");
  }
}
```

### Verify signed webhooks

If a signature secret is configured for your integration, Conduit sends an
HMAC-SHA256 signature instead of the raw secret. Verify it against the raw
request body before parsing:

```typescript
import {
  SIGNATURE_HEADER_NAME,
  isValidSignature,
  type IntegrationEvent,
} from "@conduitxyz/integrations";

const rawBody = await request.text();
const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
if (!(await isValidSignature(signature, rawBody, signatureSecret))) {
  return new Response("Unauthorized", { status: 401 });
}
const event = JSON.parse(rawBody) as IntegrationEvent;
```

The signature helpers use the Web Crypto API and run in any modern runtime
without Node.js built-ins.

### Report status asynchronously

If installation takes time (indexing, contract deployment), respond with
`INSTALLING` and later POST the final status to
`https://api.conduit.xyz/public/integrations/status/update` with your
integration secret in the `X-Conduit-Integration-Secret` header:

```typescript
import {
  SECRET_HEADER_NAME,
  constructIntegrationEventResponse,
} from "@conduitxyz/integrations";

await fetch("https://api.conduit.xyz/public/integrations/status/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    [SECRET_HEADER_NAME]: process.env.CONDUIT_INTEGRATION_SECRET!,
  },
  body: JSON.stringify(
    constructIntegrationEventResponse({
      id: networkSlug,
      status: "INSTALLED",
      manage_integration_link: "https://example.com/manage",
    })
  ),
});
```

## API

| Export | Description |
| --- | --- |
| `IntegrationEvent` | Discriminated union of webhook event payloads, narrowed by `event` |
| `IntegrationEventResponse` | Discriminated union of webhook responses, narrowed by `status` |
| `constructIntegrationEventResponse` | Builds a type-checked response object |
| `InstallationArtifact` | Artifact rendered on the Conduit dashboard (`name`, `key`, `type`, `value`) |
| `EventType`, `IntegrationStatus`, `StackType`, `NetworkType`, `NativeCurrency` | Enum-style constants and types used in payloads |
| `SECRET_HEADER_NAME` | `X-Conduit-Integration-Secret` |
| `API_KEY_HEADER_NAME` | `X-Conduit-Integration-Api-Key` (signature mode) |
| `SIGNATURE_HEADER_NAME` | `X-Conduit-Integration-Signature-256` (signature mode) |
| `isValidSecret`, `assertValidSecret` | Compare the secret header against your integration secret |
| `isValidSignature`, `assertValidSignature` | Verify the HMAC-SHA256 signature of the raw request body |
| `WebhookSecretValueError`, `WebhookSignatureValueError`, `isSecretError` | Typed errors thrown by the `assert*` helpers |

## Documentation

Full documentation, including the integration lifecycle, event payload
reference, OAuth account linking, and a copy-and-deploy Cloudflare Worker
example: [docs.conduit.xyz/chains/native-integrations](https://docs.conduit.xyz/chains/native-integrations)

## License

MIT
