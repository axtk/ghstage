import type {NavItem} from '../types/NavItem';
import {getConfig} from './getConfig';
import {getRepoLink} from './getRepoLink';

export async function getNav(nav: NavItem[]) {
    if (nav.length < 2) return '';

    let {name, contentDir} = await getConfig();
    let s = '';

    for (let {id, title, items} of nav) {
        s += `\n<li><a href="{{site.github.baseurl}}/${contentDir}/${id}">${title}</a>`;

        if (items.length !== 0) {
            s += '\n    <ul>';

            for (let {title} of items) s += `\n        <li>${title}</a>`;

            s += '\n    </ul>\n';
        }

        s += '</li>';
    }

    if (!s) return '';

    let repoLink = await getRepoLink();

    s = `<ul>${s}\n</ul>`;
    s = `${s}\n<ul class="ref">\n<li>${repoLink}</li>\n</ul>`;
    s = `<h1><a href="{{site.github.baseurl}}/">${name}</a></h1>\n${s}`;

    return `<nav>\n${s}\n</nav>`;
}
