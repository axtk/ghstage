import {append} from './append';
import {createElement} from './createElement';

export function withContainer(elements: (Element | null)[]) {
    return elements.map(element => {
        if (!element) return element;

        let extraClassName = element.matches('div')
            ? ''
            : `${element.tagName.toLowerCase()} `;

        return append(createElement('div', `${extraClassName}layer`), element);
    });
}
