export function createElement(tagName: string, className?: string) {
    let element = document.createElement(tagName);

    if (className) element.className = className;

    return element;
}
