import assert from "node:assert/strict";
import test from "node:test";
import { resolveRuntimeConfig } from "../src/config/parseConfig.js";
const asRequest = (params, query) => ({ params, query });
test("resolveRuntimeConfig uses query over env values", () => {
    process.env.NUVIO_PROVIDER = "streamio-bridge";
    process.env.NUVIO_UPSTREAM_URL = "https://v3-cinemeta.strem.io";
    const config = resolveRuntimeConfig(asRequest({}, { provider: "streamio-bridge", upstreamUrl: "https://example.com" }));
    assert.equal(config.provider, "streamio-bridge");
    assert.equal(config.upstreamUrl, "https://example.com");
});
test("resolveRuntimeConfig accepts path encoded payload", () => {
    const encoded = Buffer.from(JSON.stringify({ provider: "streamio-bridge", upstreamUrl: "https://example.org" }), "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    const config = resolveRuntimeConfig(asRequest({ config: encoded }, {}));
    assert.equal(config.provider, "streamio-bridge");
    assert.equal(config.upstreamUrl, "https://example.org");
});
