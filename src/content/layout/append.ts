export function append(
    parent: Element | null,
    children: Element | null | (Element | null)[],
) {
    if (!parent)
        return;

    if (Array.isArray(children)) {
        for (let element of children) {
            if (element !== null && element.innerHTML.trim() !== '')
                parent.appendChild(element);
        }
    }
    else if (children !== null && children.innerHTML.trim() !== '')
        parent.appendChild(children);
}
