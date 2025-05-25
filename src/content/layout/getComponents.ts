import {append} from './append';
import {createElement} from './createElement';
import {getActions} from './getActions';
import {getInstallationCode} from './getInstallationCode';
import {withPageNav} from './withPageNav';
import {withTitleLink} from './withTitleLink';

export function getComponents(container: Element) {
    let titles = Array.from(container.querySelectorAll('h1'));
    let title =
        container.querySelector<HTMLHeadingElement>('h1[id]') ?? titles.pop();

    for (let t of titles) {
        if (t !== title) t.remove();
    }

    let badges = createElement('div', 'badges');
    let description = createElement('div', 'description');
    let features = createElement('div', 'features');
    let installation = createElement('p', 'installation');
    let note = createElement('div', 'note');

    let element: Element | null | undefined = null;

    element = title?.previousElementSibling;

    while (element) {
        badges.appendChild(element);
        element = element.previousElementSibling;
    }

    element = title?.nextElementSibling;

    let sections: Element[] = [];
    let currentSection: Element | null = null;

    let introEnded = false;
    let hasFeatures = false;

    while (element) {
        let nextElement = element.nextElementSibling;
        let isSectionTitle = element.matches('h2');

        if (isSectionTitle && !introEnded) introEnded = true;

        if (introEnded) {
            if (isSectionTitle && currentSection) {
                sections.push(currentSection);
                currentSection = null;
            }

            if (!currentSection)
                currentSection = document.createElement('section');

            // if (isSectionTitle) {
            //     currentSection.id = element.id;
            //     element.removeAttribute('id');
            // }

            currentSection.appendChild(element);
        } else {
            if (element.matches('ul')) {
                features.innerHTML = '<h2>Features</h2>';
                features.appendChild(element);
                hasFeatures = true;
            } else {
                let installationCode = getInstallationCode(element);

                if (installationCode)
                    installation.appendChild(installationCode);
                else if (hasFeatures) note.appendChild(element);
                else description.appendChild(element);
            }
        }

        element = nextElement;
    }

    if (currentSection) sections.push(currentSection);

    let coverSection = append(createElement('section', 'active cover'), [
        append(createElement('div', 'section-header subsection'), [
            badges,
            withTitleLink(title),
            description,
            getActions(),
        ]),
        append(createElement('div', 'section-body subsection'), [
            features,
            note,
            installation,
        ]),
    ]);

    return {
        coverSection,
        sections: withPageNav(sections),
        installation,
    };
}
