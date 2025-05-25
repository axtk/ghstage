import {append} from './append';
import {createElement} from './createElement';
import {getRepoLink} from './getRepoLink';
import {withTitleLink} from './withTitleLink';

export function getNav(container: Element) {
    let list = document.createElement('ul');
    let currentItem: Element | null = null;

    for (let element of container.childNodes) {
        if (!(element instanceof HTMLElement)) continue;

        if (element.matches('h2')) {
            currentItem = document.createElement('li');
            currentItem.innerHTML = `<a href="#${element.id}">${element.innerHTML}</a>`;

            list.appendChild(currentItem);
        } else if (element.matches('h3') && currentItem) {
            let sublist = currentItem.querySelector('ul');

            if (!sublist) {
                sublist = document.createElement('ul');
                currentItem.appendChild(sublist);
            }

            let subitem = document.createElement('li');
            // subitem.innerHTML = `<a href="#${element.id}">${element.innerHTML}</a>`;
            subitem.innerHTML = element.innerHTML;

            sublist.appendChild(subitem);
        }
    }

    if (list.querySelectorAll(':scope > li').length < 2) return null;

    let title = container.querySelector('h1')?.innerHTML;
    let h1: HTMLHeadingElement | null = null;

    if (title) {
        h1 = document.createElement('h1');
        h1.innerHTML = title;
    }

    let refList = append(createElement('ul', 'ref'), [
        append(document.createElement('li'), getRepoLink()),
    ]);

    return append(document.createElement('nav'), [
        withTitleLink(h1),
        list,
        refList,
    ]);
}
