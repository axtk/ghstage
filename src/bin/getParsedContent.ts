import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import Markdown from 'markdown-it';
import type {NavItem} from '../types/NavItem';
import {getConfig} from './getConfig';
import {getSlug} from './getSlug';

const contentPath = './README.md';

const md = new Markdown({
    html: true,
});

function joinLines(x: string[]) {
    return x.join('\n').trim();
}

async function buildNav(dom: JSDOM) {
    let {contentDir} = await getConfig();

    let linkMap: Record<string, string> = {};
    let navItem: NavItem | null = null;
    let nav: NavItem[] = [];

    let headings =
        dom.window.document.body.querySelectorAll('h2, h3, h4, h5, h6');

    for (let element of headings) {
        let tagName = element.tagName.toLowerCase();

        let isSectionTitle = tagName === 'h2';
        let isSubsectionTitle = tagName === 'h3';

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

        if (isSectionTitle) {
            if (navItem) nav.push(navItem);

            navItem = {
                id: getSlug(element.textContent),
                title: element.innerHTML.trim(),
                items: [],
            };
        } else if (isSubsectionTitle) {
            if (navItem)
                navItem.items.push({
                    id: getSlug(element.textContent),
                    title: element.innerHTML.trim(),
                });
        }
    }

    if (navItem) nav.push(navItem);

    return {
        nav,
        linkMap,
    };
}

function getInstallationCode(element: Element) {
    return element
        .querySelector('code')
        ?.innerHTML.trim()
        .match(/(\S\s*)?(npm (i|install) .*)/)?.[2];
}

function getSectionPostprocess(linkMap: Record<string, string>) {
    return (content: string) => {
        let s = content;

        s = s.replace(/<a href="([^"]+)">/g, (_, url) => {
            if (url?.startsWith('#'))
                return `<a href="${linkMap[url] ?? url}">`;
            return `<a href="${url}" target="_blank">`;
        });

        return s;
    };
}

export async function getParsedContent() {
    let content = md.render((await readFile(contentPath)).toString());
    let dom = new JSDOM(content);

    let {nav, linkMap} = await buildNav(dom);

    let badges: string[] = [];
    let title = '';
    let description: string[] = [];
    let features: string[] = [];
    let note: string[] = [];
    let installation = '';

    let section: string[] = [];
    let sections: string[] = [];

    let hasTitle = false;
    let hasFeatures = false;
    let indexComplete = false;

    let element = dom.window.document.body.firstElementChild;

    while (element !== null) {
        if (element.matches('h1')) hasTitle = true;
        else {
            if (element.matches('h2')) {
                if (!indexComplete) indexComplete = true;

                if (section.length !== 0) {
                    sections.push(joinLines(section));
                    section = [];
                }
            }

            let {outerHTML} = element;

            if (indexComplete) section.push(outerHTML);
            else if (!hasTitle) {
                badges.push(outerHTML);
            } else if (!hasFeatures) {
                if (element.matches('ul')) {
                    hasFeatures = true;
                    features.push(outerHTML);
                } else {
                    let installationCode = getInstallationCode(element);

                    if (installationCode) installation = installationCode;
                    else description.push(outerHTML);
                }
            } else {
                let installationCode = getInstallationCode(element);

                if (installationCode) installation = installationCode;
                else note.push(outerHTML);
            }
        }

        element = element.nextElementSibling;
    }

    if (section.length !== 0) sections.push(joinLines(section));

    let postprocess = getSectionPostprocess(linkMap);

    return {
        badges: joinLines(badges),
        title,
        description: joinLines(description),
        features: joinLines(features),
        note: joinLines(note),
        installation,
        sections: sections.map(postprocess),
        nav,
    };
}
