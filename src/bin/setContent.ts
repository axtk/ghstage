import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {packageName} from '../const/packageName';
import {getConfig} from './getConfig';
import {getCounterContent} from './getCounterContent';

const exec = promisify(defaultExec);

export async function setContent() {
    let {colorScheme, theme, name, version, repo, npm} = await getConfig();

    try {
        await access('./_includes');
    }
    catch {
        await mkdir('./_includes');
    }

    let packageVersion = (await exec(`npm view ${packageName} version`)).stdout
        .trim()
        .split('.')
        .slice(0, 2)
        .join('.');

    let packageUrl = `https://unpkg.com/${packageName}@${packageVersion}`;

    let initData = {
        theme,
        name,
        version,
        repo,
        npm,
    };

    let htmlContent = '\n' + [
        await getCounterContent(),
        '',
        colorScheme
            ? `<script>document.documentElement.style.setProperty('--color-scheme', '${colorScheme}');</script>`
            : null,
        `<script>window._ghst=${JSON.stringify(initData).replace(/</g, '\\x3c')};</script>`,
        '',
        `<link rel="stylesheet" href="${packageUrl}/dist/index.css">`,
        `<script src="${packageUrl}/dist/index.js"></script>`,
    ].filter(s => s !== null).join('\n') + '\n';

    await writeFile('./_includes/head-custom.html', htmlContent);
}
