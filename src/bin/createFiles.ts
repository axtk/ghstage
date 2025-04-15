import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {getConfig} from './getConfig';
import {getDataAttrs} from './getDataAttrs';
import {setNpmIgnore} from './setNpmIgnore';

const exec = promisify(defaultExec);
const name = 'ghstage';

export async function createFiles() {
    let {colorScheme, repo, npm} = getConfig();

    await setNpmIgnore();

    try {
        await access('./_includes');
    }
    catch {
        await mkdir('./_includes');
    }

    let version = (await exec(`npm view ${name} version`)).stdout.trim();
    let majorVersion = version.split('.')[0];

    let dataAttrMap = {
        'color-scheme': colorScheme,
        repo,
        npm,
    };

    let htmlContent = `<script src="https://unpkg.com/${name}@${majorVersion}/dist/index.js"` +
        `${getDataAttrs(dataAttrMap)}></script>\n`;

    await writeFile('./_includes/head-custom.html', htmlContent);
}
