import {append} from './append';
import {createElement} from './createElement';
import {getComponents} from './getComponents';
import {getNav} from './getNav';

export function renderLayout() {
    let container = document.querySelector('body > div');

    if (!container)
        return;

    let nav = getNav(container);

    let {
        header,
        coverSection,
        sections,
        installation,
    } = getComponents(container);

    let bodyMain = append(
        createElement('main'),
        [coverSection, ...sections],
    );

    let body = append(
        createElement('div', 'body'),
        [bodyMain, nav],
    );

    let footer = append(
        createElement('footer'),
        installation,
    );

    let layout = append(
        createElement('div', 'layout'),
        [header, body, footer],
    );

    if (layout?.innerHTML.trim()) {
        container.remove();
        document.body.prepend(layout);
    }
}
