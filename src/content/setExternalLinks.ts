export function setExternalLinks() {
    let links = document.querySelectorAll('a');

    for (let link of links) {
        if (new URL(link.href).origin !== window.location.origin)
            link.setAttribute('target', '_blank');
    }
}
