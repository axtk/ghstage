export function append(
    parent: Element | null,
    children: Element | null | undefined | (Element | null | undefined)[],
) {
    if (!parent)
        return parent;

    if (Array.isArray(children)) {
        for (let element of children) {
            if (element && element.innerHTML.trim() !== '')
                parent.appendChild(element);
        }
    }
    else if (children && children.innerHTML.trim() !== '')
        parent.appendChild(children);

    return parent;
}
