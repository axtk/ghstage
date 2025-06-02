import {codeStylePath} from '../const/codeStylePath';
import {packageName} from '../const/packageName';
import {getStylePath} from '../utils/getStylePath';
import {getConfig} from './getConfig';

function appendStyleLink(scriptSrc: string, stylePath: string) {
    let styleHref = scriptSrc.replace(/\/index\.js$/, stylePath);
    let style = document.createElement('link');

    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', styleHref);

    document.head.appendChild(style);
}

export function setStyles() {
    let {scriptSrc, colorScheme, theme} = getConfig();

    let style = document.querySelector<HTMLLinkElement>(
        `link[rel="stylesheet"][href*="/${packageName}@"], ` +
            `link[rel="stylesheet"][href*="/${packageName}/"]`,
    );

    if (!style && scriptSrc) {
        appendStyleLink(scriptSrc, getStylePath(theme));
        appendStyleLink(scriptSrc, codeStylePath);
    }

    if (colorScheme)
        document.documentElement.setAttribute(
            'style',
            `--color-scheme: ${colorScheme}`,
        );

    setTimeout(() => {
        let errSpans = document.querySelectorAll('pre .err');

        for (let errSpan of errSpans) errSpan.classList.remove('err');
    }, 0);
}
