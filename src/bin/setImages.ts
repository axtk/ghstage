import {access, mkdir, writeFile} from 'node:fs/promises';
import {getIcon} from '../utils/getIcon';
import {getConfig} from './getConfig';

export async function setImages() {
    let {colorScheme} = await getConfig();

    try {
        await access('./i');
    } catch {
        await mkdir('./i');
    }

    await writeFile('./i/favicon.svg', `${getIcon(colorScheme)}\n`);
}
