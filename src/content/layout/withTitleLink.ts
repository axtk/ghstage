export function withTitleLink(title: HTMLHeadingElement | null | undefined) {
    if (title) title.innerHTML = `<a href="#">${title.textContent?.trim()}</a>`;

    return title;
}
