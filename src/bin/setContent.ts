import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {packageName} from '../const/packageName';
import {getStylePath} from '../utils/getStylePath';
import {getConfig} from './getConfig';
import {getCounterContent} from './getCounterContent';

const exec = promisify(defaultExec);

export async function setContent() {
    let {colorScheme, theme, name, version, repo, npm} = await getConfig();

    try {
        await access('./_includes');
    } catch {
        await mkdir('./_includes');
    }

    let packageVersion = (await exec(`npm view ${packageName} version`)).stdout
        .trim()
        .split('.')
        .slice(0, 2)
        .join('.');

    let packageUrl = `https://unpkg.com/${packageName}@${packageVersion}`;

    let initData = {
        name,
        version,
        repo,
        npm,
        colorScheme,
        theme,
    };

    let htmlContent = [
        await getCounterContent(),
        '',
        colorScheme
            ? `<script>document.documentElement.style.setProperty('--color-scheme', '${colorScheme}');</script>`
            : null,
        `<script>window._ghst=${JSON.stringify(initData).replace(/</g, '\\x3c')};</script>`,
        '',
        `<link rel="stylesheet" href="${packageUrl}/dist${getStylePath(theme)}">`,
        `<script src="${packageUrl}/dist/index.js"></script>`,
        '',
        '<link rel="icon" type="image/svg+xml" href="/i/favicon.svg">',
    ]
        .filter(s => s !== null)
        .join('\n');

    await writeFile('./_includes/head-custom.html', `\n${htmlContent}\n`);
}
