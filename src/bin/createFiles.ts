import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, readFile, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {parseArgs} from 'args-json';
import {getConfig} from './getConfig';

const exec = promisify(defaultExec);
const name = 'ghstage';

async function setNpmIgnore() {
    let content = '';

    try {
        content = (await readFile('./.npmignore')).toString();
    }
    catch {}

    if (!content || !/\b_includes\b/.test(content)) {
        content = content.trimEnd();
        content += `${content ? '\n' : ''}_includes\n`;
    }

    await writeFile('./.npmignore', content);
}

function getDataAttrs(attrs: Record<string, string | undefined>) {
    let s = Object.entries(attrs)
        .map(([name, value]) => value ? ` data-${name}="${value}"` : '')
        .join(' ');
}

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
