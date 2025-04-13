import {append} from './append';
import {createElement} from './createElement';
import {getInstallationCode} from './getInstallationCode';

export function getCover(container: Element) {
    let h2 = container.querySelector('h2');

    if (!h2)
        return [null, null];

    let element: Element | null = null;
    let hasFeatures = false;

    let description = createElement('div', 'description');
    let features = createElement('div', 'features');
    let installation = createElement('p', 'installation');
    let note = createElement('div', 'note');

    while ((element = container.firstElementChild) !== null && element !== h2) {
        if (element.matches('ul')) {
            features.innerHTML = '<h2>Features</h2>';
            features.appendChild(element);
            hasFeatures = true;
        }
        else {
            let installationCode = getInstallationCode(element);

            if (installationCode) {
                installation.appendChild(installationCode);
                element.remove();
            }
            else if (hasFeatures)
                note.appendChild(element);
            else
                description.appendChild(element);
        }
    }

    let cover = createElement('section', 'active cover');
    let actions = createElement('div', 'actions');

    actions.innerHTML = '<p><a href="#~start">Docs ›››</a></p>';

    append(cover, [description, actions, features, note]);

    return [cover, installation];
}
