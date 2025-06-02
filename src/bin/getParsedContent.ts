import {readFile} from 'node:fs/promises';
import type {NavItem} from '../types/NavItem';
import {getConfig} from './getConfig';
import {getSlug} from './getSlug';

const contentPath = './README.md';

function joinLines(x: string[]) {
    return x.join('\n').trim();
}

export async function getParsedContent() {
    let {contentDir} = await getConfig();

    let content = (await readFile(contentPath)).toString();
    let lines = content.split(/\r?\n/);

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

    let linkMap: Record<string, string> = {};

    let titleComplete = false;
    let featuresStarted = false;
    let featuresComplete = false;
    let indexComplete = false;

    for (let line of lines) {
        if (/^#+\s/.test(line)) {
            let hash = `#${getSlug(line.replace(/^#+/, ''))}`;
            let keepHash = /^#{3,}\s/.test(line);

            if (linkMap[hash] === undefined)
                linkMap[hash] =
                    `{{site.github.baseurl}}/${contentDir}/${navItem?.id ?? ''}${keepHash ? hash : ''}`;
        }

        if (line.startsWith('# ')) {
            title = line;
            titleComplete = true;
            continue;
        }

        if (line.startsWith('## ')) {
            if (!indexComplete) indexComplete = true;

            if (section.length !== 0) {
                sections.push(joinLines(section));
                section = [];
            }

            if (navItem) nav.push(navItem);

            let navItemTitle = line.slice(2).trim();

            navItem = {
                id: getSlug(navItemTitle),
                title: navItemTitle,
                items: [],
            };
        }

        if (line.startsWith('### ') && navItem) {
            let navItemSubtitle = line.slice(3).trim();

            navItem.items.push({
                id: getSlug(navItemSubtitle),
                title: navItemSubtitle,
            });
        }

        if (indexComplete) section.push(line);
        else {
            if (!titleComplete) {
                badges.push(line);
                continue;
            }

            if (
                !featuresComplete &&
                (line.startsWith('- ') || line.startsWith('* '))
            ) {
                featuresStarted = true;
                features.push(line);
                continue;
            }

            if (!featuresStarted) {
                description.push(line);
                continue;
            }

            featuresComplete = true;

            let installationMatches = line.match(/`(npm (i|install) [^`]+)`/);

            if (installationMatches) installation = installationMatches[1];
            else note.push(line);
        }
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
        sections: sections.map(s => {
            return s.replace(
                /\]\((#[^\)]+)\)/g,
                (_, hash) => `](${linkMap[hash] ?? hash})`,
            );
        }),
        nav,
    };
}
