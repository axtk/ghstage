import {getConfig} from '../getConfig';
import {createElement} from './createElement';

export function getActions() {
    let {repo /*, npm */} = getConfig();
    let links = createElement('p', 'actions');

    links.innerHTML = [
        '<a href="#~start" data-type="docs" class="primary">Docs ›››</a>',
        repo ? `<a href="${repo}" data-type="repo">GitHub</a>` : null,
        // npm ? `<a href="${npm}" data-type="npm">npm</a>` : null,
    ]
        .filter(link => link !== null)
        .join('<span class="sep"> &bull; </span>');

    return links;
}
