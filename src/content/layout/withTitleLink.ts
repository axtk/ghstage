export function withTitleLink(title: HTMLHeadingElement | null) {
    if (title)
        title.innerHTML = `<a href="#">${title.innerHTML}</a>`;

    return title;
}
