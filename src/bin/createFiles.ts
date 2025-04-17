import {setCName} from './setCName';
import {setContent} from './setContent';
import {setNpmIgnore} from './setNpmIgnore';

export async function createFiles() {
    await setNpmIgnore();
    await setCName();
    await setContent();
}
