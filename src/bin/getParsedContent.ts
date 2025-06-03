import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import Markdown from 'markdown-it';
import type {NavItem} from '../types/NavItem';
import {getConfig} from './getConfig';
import {getSlug} from './getSlug';

const contentPath = './README.md';
const md = new Markdown({html: true});

function joinLines(x: string[]) {
    return x.join('\n').trim();
}

export async function getParsedContent() {
    let {contentDir} = await getConfig();

    let content = md.render((await readFile(contentPath)).toString());
    let dom = new JSDOM(content);

    let linkMap: Record<string, string> = {};

    let badges: string[] = [];
    let title = '';
    let description: string[] = [];
    let features: string[] = [];
    let note: string[] = [];
    let installation = '';

    let section: string[] = [];
    let sections: string[] = [];

    let navItem: NavItem | null = null;
    let nav: NavItem[] = [];

    let titleComplete = false;
    let featuresStarted = false;
    let featuresComplete = false;
    let indexComplete = false;

    let element: Element | null = dom.window.document.body.firstElementChild;

    while (element !== null) {
        if (element.matches('h2, h3, h4, h5, h6')) {
            let isSectionTitle = element.matches('h2');
            let sectionId = isSectionTitle
                ? getSlug(element.textContent)
                : (navItem?.id ?? '');
            let elementId = element.id;

            if (!elementId)
                elementId = getSlug(element.textContent)
                    .toLowerCase()
                    .replace(/_/g, '-');

            if (elementId) {
                element.id = elementId;

                let link = `{{site.github.baseurl}}/${contentDir}/${sectionId}`;

                if (!isSectionTitle) link += `#${elementId}`;

                linkMap[`#${elementId}`] = link;
            }
        }

        if (element.matches('h1')) {
            title = element.outerHTML;
            titleComplete = true;
            continue;
        }

        if (element.matches('h2')) {
            if (!indexComplete) indexComplete = true;

            if (section.length !== 0) {
                sections.push(joinLines(section));
                section = [];
            }

            if (navItem) nav.push(navItem);

            navItem = {
                id: getSlug(element.textContent),
                title: element.innerHTML.trim(),
                items: [],
            };
        }

        if (element.matches('h3') && navItem) {
            navItem.items.push({
                id: getSlug(element.textContent),
                title: element.innerHTML.trim(),
            });
        }

        let {outerHTML} = element;

        if (indexComplete) section.push(outerHTML);
        else {
            if (!titleComplete) {
                badges.push(outerHTML);
                continue;
            }

            if (!featuresComplete && element.matches('ul')) {
                featuresStarted = true;
                features.push(outerHTML);
                continue;
            }

            if (!featuresStarted) {
                description.push(outerHTML);
                continue;
            }

            featuresComplete = true;

            let code = element.querySelector('code');
            let installationMatches = code?.innerHTML
                .trim()
                .match(/(\S\s*)?(npm (i|install) .*)/);

            if (installationMatches) installation = installationMatches[2];
            else note.push(outerHTML);
        }

        element = element.nextElementSibling;
    }

    if (section.length !== 0) sections.push(joinLines(section));

    if (navItem) nav.push(navItem);

    return {
        badges: joinLines(badges),
        title,
        description: joinLines(description),
        features: joinLines(features),
        note: joinLines(note),
        installation,
        sections: section.map(s => {
            return s.replace(
                / href="(#[^"]+)"/,
                (_, hash) => linkMap[hash] ?? hash,
            );
        }),
        nav,
    };
}
