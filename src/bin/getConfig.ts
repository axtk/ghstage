import { readFile } from "node:fs/promises";
import { parseArgs } from "args-json";
import type { BinConfig } from "../types/BinConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { toConfig } from "./toConfig";

let config: BinConfig | null = null;

export async function getConfig(): Promise<BinConfig> {
  if (config) return config;

  let metadata: PackageMetadata = {};

  try {
    metadata = JSON.parse(
      (await readFile("./package.json")).toString(),
    ) as PackageMetadata;
  } catch {}

  config = {
    ghPagesBranch: "gh-pages",
    mainBranch: "main",
    rootPath: "/",
    contentDir: "x",
    ...toConfig(metadata),
    ...parseArgs<BinConfig>(process.argv.slice(2)),
  };

  if (config.theme === "t8") {
    config.scope = "/";

    let rootPath = config.name?.split("/").at(-1);

    if (rootPath && config.rootPath === "/")
      config.rootPath = `/${rootPath}/`;
  }

  return config;
}
