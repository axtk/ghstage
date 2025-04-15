// import {getConfig} from '../getConfig';
import {append} from './append';
import {createElement} from './createElement';

export function getHeader(container: Element) {
    let header = createElement('header');
    let title = container.querySelector('h1');

    if (title) {
        title.innerHTML = `<a href="#">${title.innerHTML}</a>`;

        append(header, title);
    }

    // let {repo, npm} = getConfig();
    // let links = createElement('p', 'actions');

    // links.innerHTML = [
    //     repo ? `<a href="${repo}" class="repo">GitHub</a>` : null,
    //     npm ? `<a href="${npm}" class="npm">npm</a>` : null,
    // ].filter(link => link !== null).join('<span class="sep"> &bull; </span>');

    // append(header, links);

    return header;
}
