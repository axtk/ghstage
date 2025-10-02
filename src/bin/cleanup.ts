import { rm } from "node:fs/promises";

export async function cleanup() {
  await Promise.all(
    ["./_layouts", "./x", "./index.html"].map(path => {
      return rm(path, { force: true, recursive: true });
    }),
  );
}
