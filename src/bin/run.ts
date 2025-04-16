#!/usr/bin/env node
import {exec as defaultExec} from 'node:child_process';
import {promisify} from 'node:util';
import {createFiles} from './createFiles';
import {getConfig} from './getConfig';

const exec = promisify(defaultExec);

async function run() {
    let {ghPagesBranch, mainBranch} = await getConfig();

    let originalBranch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.trim();

    if (originalBranch === ghPagesBranch)
        await exec(`git checkout ${mainBranch}`);

    await exec(`git branch -D ${ghPagesBranch}`);
    await exec(`git push origin --delete ${ghPagesBranch}`);
    await exec(`git checkout -b ${ghPagesBranch}`);
    await createFiles();
    await exec('git add *');

    let updated = (await exec('git diff --cached --name-only')).stdout.trim() !== '';

    if (updated)
        await exec(`git commit -m "release gh-pages"`);

    await exec(`git push -u origin ${ghPagesBranch}`);

    if (originalBranch && originalBranch !== ghPagesBranch)
        await exec(`git checkout ${originalBranch}`);
}

(async () => {
    await run();
})();
