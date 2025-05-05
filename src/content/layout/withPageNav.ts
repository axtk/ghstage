import {append} from './append';
import {createElement} from './createElement';

export function withPageNav(sections: Element[]) {
    for (let i = 0; i < sections.length; i++) {
        let pagenav = createElement('p', 'pagenav');
        let prev = '';
        let next = '';

        if (i === 0) prev = '<a href="#">Intro</a>';
        else {
            let prevSectionId =
                sections[i - 1]?.id || sections[i - 1]?.querySelector('h2')?.id;
            let prevSectionTitle =
                sections[i - 1]?.querySelector('h2')?.innerHTML;

            if (prevSectionId && prevSectionTitle)
                prev = `<a href="#${prevSectionId}">${prevSectionTitle}</a>`;
        }

        if (i !== sections.length - 1) {
            let nextSectionId =
                sections[i + 1]?.id || sections[i + 1]?.querySelector('h2')?.id;
            let nextSectionTitle =
                sections[i + 1]?.querySelector('h2')?.innerHTML;

            if (nextSectionId && nextSectionTitle)
                next = `<a href="#${nextSectionId}">${nextSectionTitle}</a>`;
        }

        pagenav.innerHTML = [
            prev
                ? `<span class="prev"><span class="icon">&larr;</span> ${prev}</span>`
                : null,
            next
                ? `<span class="next">${next} <span class="icon">&rarr;</span></span>`
                : null,
        ]
            .filter(item => item !== null)
            .join('<span class="sep"> | </span>');

        append(sections[i], pagenav);
    }

    return sections;
}
