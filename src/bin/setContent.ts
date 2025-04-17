import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {getConfig} from './getConfig';
import {getCounterContent} from './getCounterContent';
import {getDataAttrs} from './getDataAttrs';

const exec = promisify(defaultExec);
const scriptName = 'ghstage';

export async function setContent() {
    let {colorScheme, theme, name, version, repo, npm} = await getConfig();

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
        theme,
        name,
        version,
        repo,
        npm,
    };

    let htmlContent = (await getCounterContent()) +
        `<script src="https://unpkg.com/${scriptName}@${scriptVersion}/dist/index.js"` +
        `${getDataAttrs(dataAttrMap)}></script>\n`;

    await writeFile('./_includes/head-custom.html', htmlContent);
}
