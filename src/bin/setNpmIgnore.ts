import {readFile, writeFile} from 'node:fs/promises';

export async function setNpmIgnore() {
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
