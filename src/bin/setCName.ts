import {writeFile} from 'node:fs/promises';
import {getConfig} from './getConfig';

export async function setCName() {
    let {name, cname} = await getConfig();
    let domain = '';

    if (cname === undefined)
        return;

    if (typeof cname === 'string')
        domain = cname;
    else if (cname === true)
        domain = name ? `${name}.js.org` : '';

    if (domain !== '')
        await writeFile('./CNAME', domain);
}
