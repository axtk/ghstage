#!/usr/bin/env node
import { exec as defaultExec } from "node:child_process";
import { access } from "node:fs/promises";
import { promisify } from "node:util";
import { cleanup } from "./cleanup";
import { createFiles } from "./createFiles";
import { getConfig } from "./getConfig";

const exec = promisify(defaultExec);
const stdout = async (cmd: string) => (await exec(cmd)).stdout.trim();

async function run() {
  let isGitDir = false;

  try {
    await access("./.git");
    isGitDir = true;
  } catch {}

  if (!isGitDir) {
    await cleanup();
    await createFiles();
    return;
  }

  let { ghPagesBranch, mainBranch, remove } = await getConfig();
  let ghPagesBranchExists = false;

  let originalBranch = await stdout("git rev-parse --abbrev-ref HEAD");

  try {
    ghPagesBranchExists = originalBranch === ghPagesBranch ||
      (await stdout(`git ls-remote --heads origin ${ghPagesBranch}`)) !== "";
  } catch {}

  if (remove) {
    if (originalBranch === ghPagesBranch)
      await exec(`git checkout ${mainBranch}`);

    if (ghPagesBranchExists) {
      try {
        await exec(`git branch -D ${ghPagesBranch}`);
        await exec(`git push origin --delete ${ghPagesBranch}`);
      } catch {}
    }

    return;
  }

  if (originalBranch !== ghPagesBranch)
    await exec(`git checkout${ghPagesBranchExists ? "" : " -b"} ${ghPagesBranch}`);

  await cleanup();
  await createFiles();
  await exec("git add *");

  let updated = (await stdout("git diff --cached --name-only")) !== "";

  if (updated) await exec("git commit -m \"release gh-pages\"");

  await exec(`git push -u origin ${ghPagesBranch}`);

  if (originalBranch && originalBranch !== ghPagesBranch)
    await exec(`git checkout ${originalBranch}`);
}

(async () => {
  await run();
})();
