import {setCName} from './setCName';
import {setContent} from './setContent';
import {setNpmIgnore} from './setNpmIgnore';

export async function createFiles() {
    await Promise.all([
        setNpmIgnore(),
        setCName(),
        setContent(),
    ]);
}
