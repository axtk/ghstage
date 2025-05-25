import {getConfig} from '../getConfig';
import {append} from './append';
import {withTitleLink} from './withTitleLink';

export function getNav(container: Element) {
    let {repo} = getConfig();

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

    if (list.querySelectorAll(':scope > li').length < 2)
        return null;

    let title = container.querySelector('h1')?.innerHTML;
    let h1: HTMLHeadingElement | null = null;

    if (title) {
        h1 = document.createElement('h1');
        h1.innerHTML = title;
    }

    let refList = document.createElement('ul');

    refList.className = 'ref';

    if (repo) {
        let repoRef = document.createElement('li');
        let repoTitle = /\bgithub\.com\//.test(repo) ? 'GitHub' : 'Repository';

        repoRef.innerHTML = `<a href="${repo}">${repoTitle}</a>`;
        refList.appendChild(repoRef);
    }

    let nav = document.createElement('nav');

    append(nav, [withTitleLink(h1), list, refList]);

    return nav;
}
