# Nuvio Stream.io Bridge Addon

A production-ready TypeScript addon for Nuvio that implements a Stream.io-compatible provider pipeline with:

- Addon initialization
- Provider registration
- Catalog / Meta / Stream handlers
- Runtime configuration support
- Structured logging
- Error normalization

## Requirements

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server defaults to `http://localhost:7000`.

## Build

```bash
npm run build
```

## Run Production Build

```bash
npm run start
```

## Configuration

The addon supports three configuration sources (highest priority first):

1. Query params: `?provider=streamio-bridge&upstreamUrl=https://...`
   - Optional auth header: `x-nuvio-api-key: <key>` (or standard Authorization bearer token)
2. Base64URL JSON path prefix:
   - `/{base64url-json}/manifest.json`
   - `/{base64url-json}/catalog/movie/bridge-movies.json`
3. Environment variables:
   - `PORT` (default: `7000`)
   - `LOG_LEVEL` (default: `info`)
   - `NUVIO_PROVIDER` (default: `streamio-bridge`)
   - `NUVIO_UPSTREAM_URL` (default: `https://v3-cinemeta.strem.io`)
   - `NUVIO_API_KEY` (optional)
   - `NUVIO_REQUEST_TIMEOUT_MS` (default: `12000`)

### Example encoded configuration

```json
{"provider":"streamio-bridge","upstreamUrl":"https://v3-cinemeta.strem.io"}
```

Base64URL-encode this JSON and call:

```text
/{encoded}/manifest.json
```

## Endpoints

- `GET /manifest.json`
- `GET /catalog/:type/:id.json`
- `GET /catalog/:type/:id/:extra.json`
- `GET /meta/:type/:id.json`
- `GET /stream/:type/:id.json`

Each endpoint also supports an optional `/:config/` prefix for encoded runtime configuration.

## Deployment

1. Build the addon: `npm run build`
2. Start it: `npm run start`
3. Deploy on any Node.js host (Fly.io, Render, Railway, Docker, etc.)
4. Expose `manifest.json` publicly and install in Nuvio.

## Testing

```bash
npm test
```
