import {append} from './append';
import {createElement} from './createElement';
import {getComponents} from './getComponents';
import {getNav} from './getNav';
import {withContainer} from './withContainer';

export function renderLayout() {
    let container = document.querySelector('body > div');

    if (!container) return;

    let nav = getNav(container);

    let {coverSection, sections} = getComponents(container);

    let bodyMain = append(createElement('main'), [coverSection, ...sections]);

    let body = append(createElement('div', `body${nav ? '' : ' no-nav'}`), [bodyMain, nav]);

    let layout = append(createElement('div', 'layout'), withContainer([body]));

    if (layout?.innerHTML.trim()) {
        container.remove();
        document.body.prepend(layout);
    }
}
