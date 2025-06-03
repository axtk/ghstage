import {exec as defaultExec} from 'node:child_process';
import {access, mkdir, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {escapeHTML} from 'stfm';
import {packageName} from '../const/packageName';
import {getConfig} from './getConfig';
import {getCounterContent} from './getCounterContent';
import {getNav} from './getNav';
import {getParsedContent} from './getParsedContent';
import {getRepoLink} from './getRepoLink';
import {toFileContent} from './toFileContent';

const exec = promisify(defaultExec);

export async function setContent() {
    let {
        colorScheme,
        contentDir,
        name,
        description: packageDescription,
        backstory,
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
                `./${contentDir}/${nav[i]?.id ?? `_untitled_${i}`}.html`,
                toFileContent(`
---
layout: section
id: "${nav[i]?.id ?? ''}"
title: "${nav[i]?.title ?? ''}"
prev:
    id: "${nav[i - 1]?.id ?? ''}"
    title: "${nav[i - 1]?.title ?? ''}"
next:
    id: "${nav[i + 1]?.id ?? ''}"
    title: "${nav[i + 1]?.title ?? ''}"
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
${nav[0] ? `<link rel="prefetch" href="{{site.github.baseurl}}/${contentDir}/${nav[0]?.id ?? ''}">` : ''}
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
        ${badges}
    </div>
    <h1>${name}</h1>
    <div class="description">
        ${description}
    </div>
    <p class="actions">
        <a href="{{site.github.baseurl}}/start" class="primary button">Docs ›››</a>
        <span class="sep"> • </span>
        ${await getRepoLink('button')}
    </p>
    ${backstory ? `<p class="ref"><a href="${backstory}">Backstory</a></p>` : ''}
</section>
<section class="intro">
    <div class="features">
        <h2>Features</h2>
        ${features}
    </div>
    <p class="installation"><code>${installation}</code></p>
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
<title>{{page.title | strip_html}} | ${escapedName}</title>
<link rel="stylesheet" href="${packageUrl}/dist/css/base.css">
<link rel="stylesheet" href="${packageUrl}/dist/css/section.css">
<link rel="icon" type="image/svg+xml" href="{{site.github.baseurl}}/favicon.svg">
{% unless page.next.id == '' %}<link rel="prefetch" href="{{site.github.baseurl}}/${contentDir}/{{page.next.id}}">{% endunless %}
{% unless page.prev.id == '' %}<link rel="prefetch" href="{{site.github.baseurl}}/${contentDir}/{{page.prev.id}}">{% endunless %}
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
        {% if page.prev.id == '' %}<a href="{{site.github.baseurl}}/">Intro</a>{% else %}<a href="{{site.github.baseurl}}/${contentDir}/{{page.prev.id}}">{{page.prev.title}}</a>{% endif %}
    </span>
    <span class="sep">|</span>
    {% if page.next.id == '' %}
    <span class="repo next">
        ${await getRepoLink()}
        <span class="icon">✦</span>
    </span>
    {% else %}
    <span class="next">
        <a href="{{site.github.baseurl}}/${contentDir}/{{page.next.id}}">{{page.next.title}}</a>
        <span class="icon">→</span>
    </span>
    {% endif %}
</p>
</main>
</div>
</div>

{% if content contains '<pre><code ' %}<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/base16/material.min.css">
<script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js"></script>
<script>hljs.highlightAll()</script>{% elsif content contains '<pre ' %}<link rel="stylesheet" href="${packageUrl}/dist/css/code.lightbulb.css">
{% endif %}
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
    <meta http-equiv="refresh" content="0; URL={{site.github.baseurl}}/${contentDir}/{{page.start_id}}">
    <title>${escapedName}</title>
    <link rel="stylesheet" href="${packageUrl}/dist/css/base.css">
    <link rel="icon" type="image/svg+xml" href="{{site.github.baseurl}}/favicon.svg">
</head>
<body>
<div class="layout">
    <h1>${escapedName}</h1>
</div>

${counterContent}
</body>
</html>
            `),
        ),
        writeFile(
            './start.html',
            toFileContent(`
---
layout: start
start_id: "${nav[0]?.id ?? ''}"
---
            `),
        ),
    ]);
}
