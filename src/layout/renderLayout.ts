import {append} from './append';
import {createElement} from './createElement';
import {getCover} from './getCover';
import {getNav} from './getNav';
import {getSections} from './getSections';

export function renderLayout() {
    let container = document.querySelector('body > div');

    if (!container)
        return;

    let layout = createElement('div', 'layout');
    let body = createElement('div', 'body');
    let header = createElement('header');
    let footer = createElement('footer');

    let title = container.querySelector('h1');

    if (title) {
        title.innerHTML = `<a href="#">${title.innerHTML}</a>`;

        append(header, title);
    }

    let [cover, installation] = getCover(container);
    let nav = getNav(container);

    let bodyMain = createElement('main');
    let sections = getSections(container);

    append(bodyMain, [cover, ...sections]);
    append(body, [bodyMain, nav]);
    append(footer, installation);
    append(layout, [header, body, footer]);

    container.remove();
    document.body.prepend(layout);
}
