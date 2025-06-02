import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import Markdown from 'markdown-it';
import {escapeHTML} from 'stfm';
import {packageName} from '../const/packageName';
import {getConfig} from './getConfig';
import {getCounterContent} from './getCounterContent';
import {getNav} from './getNav';
import {getParsedContent} from './getParsedContent';
import {getRepoLink} from './getRepoLink';
import {toFileContent} from './toFileContent';

const exec = promisify(defaultExec);
const md = new Markdown({html: true});

export async function setContent() {
    let {
        colorScheme,
        contentDir,
        name,
        description: packageDescription,
    } = await getConfig();

    let {badges, description, features, installation, sections, nav} =
        await getParsedContent();

    let counterContent = await getCounterContent();
    let navContent = await getNav(nav);
    let escapedName = escapeHTML(name);

    await Promise.all(
        ['./_layouts', `./${contentDir}`].map(async path => {
            try {
                await access(path);
            } catch {
                await mkdir(path);
            }
        }),
    );

    let packageVersion = (await exec(`npm view ${packageName} version`)).stdout
        .trim()
        .split('.')
        .slice(0, 2)
        .join('.');

    let packageUrl = `https://unpkg.com/${packageName}@${packageVersion}`;

    await Promise.all([
        ...sections.map((content, i) =>
            writeFile(
                `./${contentDir}/${nav[i].id ?? `_untitled_${i}`}.md`,
                toFileContent(`
---
layout: section
section:
    id: "${nav[i].id ?? ''}"
    title: "${md.renderInline(nav[i].title ?? '')}"
prev_section:
    id: "${nav[i - 1]?.id ?? ''}"
    title: "${md.renderInline(nav[i - 1]?.title ?? '')}"
next_section:
    id: "${nav[i + 1]?.id ?? ''}"
    title: "${md.renderInline(nav[i + 1]?.title ?? '')}"
---

${content}
            `),
            ),
        ),
        writeFile(
            './_layouts/index.html',
            toFileContent(`
<!DOCTYPE html>
<html lang="en"${colorScheme ? ` style="--color-scheme: ${colorScheme}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapedName}${packageDescription ? ` | ${escapeHTML(packageDescription)}` : ''}</title>
<link rel="stylesheet" href="${packageUrl}/dist/css/base.css">
<link rel="stylesheet" href="${packageUrl}/dist/css/index.css">
<link rel="stylesheet" href="${packageUrl}/dist/css/code.lightbulb.css">
<link rel="icon" type="image/svg+xml" href="{{site.github.baseurl}}/favicon.svg">
</head>
<body>
<div class="layout">
<main>
{{content}}
</main>
</div>

${counterContent}
</body>
</html>
            `),
        ),
        writeFile(
            './index.html',
            toFileContent(`
---
layout: index
---

<section class="intro-title">
    <div class="badges">
        ${md.render(badges)}
    </div>
    <h1>${name}</h1>
    <div class="description">
        ${md.render(description)}
    </div>
    <p class="actions">
        <a href="{{site.github.baseurl}}/start" class="primary button">Docs ›››</a>
        <span class="sep"> • </span>
        ${await getRepoLink('button')}
    </p>
</section>
<section class="intro">
    <div class="features">
        <h2>Features</h2>
        ${md.render(features)}
    </div>
    <p class="installation"><code>${escapeHTML(installation)}</code></p>
</section>
            `),
        ),
        writeFile(
            './_layouts/section.html',
            toFileContent(`
<!DOCTYPE html>
<html lang="en"${colorScheme ? ` style="--color-scheme: ${colorScheme}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{page.section.title | strip_html}} | ${escapedName}</title>
<link rel="stylesheet" href="${packageUrl}/dist/css/base.css">
<link rel="stylesheet" href="${packageUrl}/dist/css/section.css">
<link rel="stylesheet" href="${packageUrl}/dist/css/code.lightbulb.css">
<link rel="icon" type="image/svg+xml" href="{{site.github.baseurl}}/favicon.svg">
</head>
<body>
<div class="layout">
<div class="${navContent ? '' : 'no-nav '}body">
${navContent}
<main>
{{content}}

<p class="pagenav">
    <span class="prev">
        <span class="icon">←</span>
        {% if page.prev_section.id == "" %}<a href="{{site.github.baseurl}}/">Intro</a>{% else %}<a href="{{site.github.baseurl}}/${contentDir}/{{page.prev_section.id}}">{{page.prev_section.title}}</a>{% endif %}
    </span>
    <span class="sep">|</span>
    {% if page.next_section.id == "" %}
    <span class="repo next">
        ${await getRepoLink()}
        <span class="icon">✦</span>
    </span>
    {% else %}
    <span class="next">
        <a href="{{site.github.baseurl}}/${contentDir}/{{page.next_section.id}}">{{page.next_section.title}}</a>
        <span class="icon">→</span>
    </span>
    {% endif %}
</p>
</main>
</div>
</div>

${counterContent}
</body>
</html>
            `),
        ),
        writeFile(
            './_layouts/start.html',
            toFileContent(`
<!DOCTYPE html>
<html lang="en" class="blank"${colorScheme ? ` style="--color-scheme: ${colorScheme}"` : ''}>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="refresh" content="0; URL={{site.github.baseurl}}/${contentDir}/{{page.start_section_id}}">
    <title>${escapedName}</title>
    <link rel="stylesheet" href="${packageUrl}/dist/css/base.css">
    <link rel="icon" type="image/svg+xml" href="{{site.github.baseurl}}/favicon.svg">
</head>
<body>
<div class="layout">
    <h1>${escapedName}</h1>
</div>
</body>
</html>
            `),
        ),
        writeFile(
            './start.html',
            toFileContent(`
---
layout: start
start_section_id: "${nav[0].id}"
---
            `),
        ),
    ]);
}
