const startHash = '#~start';

function start() {
    let firstSection = document.querySelector('main section:not(.cover)');
    let firstSectionId = firstSection?.id || firstSection?.querySelector('h2')?.id;

    if (firstSectionId)
        window.location.assign(`#${firstSectionId}`);
}

function deactivateSections() {
    let sections = document.querySelectorAll('main section');

    for (let section of sections)
        section.classList.remove('active');
}

function isSectionActive(section: Element | null) {
    return section?.classList.contains('active');
}

function activateSection(section: Element | null) {
    document.documentElement.className = section?.classList.contains('cover')
        ? '_cover'
        : '_regular';

    if (!section || isSectionActive(section))
        return;

    deactivateSections();
    section.classList.add('active');
}

function activateCover() {
    activateSection(document.querySelector('main section.cover'));
}

function handleHash() {
    let {hash, pathname, search} = window.location;

    window.sendHit?.();

    if (!hash || hash === '#') {
        if (window.location.href.endsWith('#'))
            window.history.replaceState({}, '', pathname + search);

        return activateCover();
    }

    if (hash === startHash)
        return start();

    let target = document.querySelector(hash);
    let targetSection = target?.closest('main section');

    if (!target || !targetSection)
        return activateCover();

    activateSection(targetSection);

    if (target.matches('h2'))
        window.scrollTo(0, 0);
    else target.scrollIntoView();

    let navLinks = document.querySelectorAll('.body > nav a');

    for (let link of navLinks)
        link.classList.toggle('active', link.getAttribute('href') === hash);
}

export function setNav() {
    handleHash();

    document.body.addEventListener('click', event => {
        let {target} = event;

        if (target instanceof HTMLElement && target.matches(`a[href="${startHash}"]`)) {
            event.preventDefault()
            start();
        }
    });

    window.addEventListener('hashchange', handleHash);
}
