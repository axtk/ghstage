import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, readFile, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {parseArgs} from 'args-json';

const exec = promisify(defaultExec);
const name = 'ghstage';

type Config = {
    colorScheme?: string;
};

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

export async function createFiles() {
    let {colorScheme} = parseArgs<Config>(process.argv.slice(2));

    await setNpmIgnore();

    try {
        await access('./_includes');
    }
    catch {
        await mkdir('./_includes');
    }

    let version = (await exec(`npm view ${name} version`)).stdout.trim();

    let htmlContent = `<script src="https://unpkg.com/${name}@${version}/dist/index.js"` +
        `${colorScheme ? ` data-color-scheme="${colorScheme}"` : ''}></script>\n`;

    await writeFile('./_includes/head-custom.html', htmlContent);
}
