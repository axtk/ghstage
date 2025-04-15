export function getNav(container: Element) {
    let list = document.createElement('ul');
    let currentItem: Element | null = null;

    for (let element of container.childNodes) {
        if (!(element instanceof HTMLElement))
            continue;

        if (element.matches('h2')) {
            currentItem = document.createElement('li');
            currentItem.innerHTML = `<a href="#${element.id}">${element.innerHTML}</a>`;

            list.appendChild(currentItem);
        }
        else if (element.matches('h3') && currentItem) {
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

    let nav = document.createElement('nav');

    nav.appendChild(list);

    return nav;
}
