import type {NavItem} from '../types/NavItem';
import {getConfig} from './getConfig';
import {getRepoLink} from './getRepoLink';

export async function getNav(nav: NavItem[]) {
    if (nav.length < 2) return '';

    let {contentDir, backstory} = await getConfig();
    let s = '';

    for (let {id, title, items} of nav) {
        s += `\n<li>{% if page.id == "${id}" %}<strong>${title}</strong>{% else %}<a href="{{site.github.baseurl}}/${contentDir}/${id}">${title}</a>{% endif %}`;

        if (items.length !== 0) {
            s += '\n    <ul>';

            for (let {title} of items) s += `\n        <li>${title}</li>`;

            s += '\n    </ul>\n';
        }

        s += '</li>';
    }

    if (!s) return '';

    let repoLink = await getRepoLink();

    s = `<ul>${s}\n</ul>`;
    s = `${s}
<ul class="ref">
    <li>${repoLink}</li>
    ${backstory ? `<li><a href="${backstory}">Backstory</a></li>` : ''}
</ul>`;

    return `<nav>\n${s}\n</nav>`;
}
