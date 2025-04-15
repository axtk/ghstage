#!/usr/bin/env node
import {exec as defaultExec} from 'node:child_process';
import {promisify} from 'node:util';
import {createFiles} from './createFiles';
import {getConfig} from './getConfig';

const exec = promisify(defaultExec);

async function run() {
    let {ghPagesBranch, mainBranch} = await getConfig();

    let originalBranch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.trim();
    let branchExists = true;

    if (originalBranch !== ghPagesBranch) {
        try {
            branchExists = (await exec(`git show-ref --quiet refs/heads/${ghPagesBranch}`)).stderr.trim() === '';
        }
        catch {
            branchExists = false;
        }

        await exec(`git checkout ${branchExists ? '' : '-b '}${ghPagesBranch}`);
    }

    await exec(`git rebase ${mainBranch}`);
    await createFiles();
    await exec('git add *');

    let updated = (await exec('git diff --cached --name-only')).stdout.trim() !== '';

    if (updated)
        await exec(`git commit -m "${branchExists ? 'update' : 'add'} gh-pages"`);

    await exec(`git push origin ${ghPagesBranch}`);

    if (originalBranch && originalBranch !== ghPagesBranch)
        await exec(`git checkout ${originalBranch}`);
}

(async () => {
    await run();
})();
