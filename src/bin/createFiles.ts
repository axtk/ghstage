import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {getConfig} from './getConfig';
import {getDataAttrs} from './getDataAttrs';
import {setNpmIgnore} from './setNpmIgnore';

const exec = promisify(defaultExec);
const scriptName = 'ghstage';

export async function createFiles() {
    let {colorScheme, name, version, repo, npm} = await getConfig();

    await setNpmIgnore();

    try {
        await access('./_includes');
    }
    catch {
        await mkdir('./_includes');
    }

    let scriptVersion = (await exec(`npm view ${scriptName} version`)).stdout
        .trim()
        .split('.')[0];

    let dataAttrMap = {
        'color-scheme': colorScheme,
        name,
        version,
        repo,
        npm,
    };

    let htmlContent = '<script ' +
        `src="https://unpkg.com/${scriptName}@${scriptVersion}/dist/index.js"` +
        `${getDataAttrs(dataAttrMap)}></script>\n`;

    await writeFile('./_includes/head-custom.html', htmlContent);
}
