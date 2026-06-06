import manifestJson from "../manifest.json" assert { type: "json" };
import type { AddonManifest } from "./types.js";

export const manifest: AddonManifest = manifestJson as AddonManifest;
