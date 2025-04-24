import {packageName} from '../const/packageName';
import {getStylePath} from '../utils/getStylePath';
import {getSVGDataURL} from '../utils/getSVGDataURL';
import {getBackground} from './getBackground';
import {getConfig} from './getConfig';

export function setStyles() {
    // let styles = document.querySelectorAll('link[rel="stylesheet"]');

    // for (let style of styles)
    //     style.remove();

    let {scriptSrc, colorScheme, theme} = getConfig();

    let style = document.querySelector<HTMLLinkElement>(
        `link[rel="stylesheet"][href*="/${packageName}@"], ` +
        `link[rel="stylesheet"][href*="/${packageName}/"]`
    );

    if (!style && scriptSrc) {
        let styleHref = scriptSrc.replace(/\/index\.js$/, getStylePath(theme));

        style = document.createElement('link');

        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', styleHref);

        document.head.appendChild(style);
    }

    if (colorScheme)
        document.documentElement.setAttribute('style', `--color-scheme: ${colorScheme}`);

    setTimeout(() => {
        let errSpans = document.querySelectorAll('pre .err');

        for (let errSpan of errSpans)
            errSpan.classList.remove('err');
    }, 0);

    if (theme === 'tiles') {
        let bgStyle = document.createElement('style');

        bgStyle.textContent = `html{background-image:url("${getSVGDataURL(getBackground())}");}`;

        document.body.appendChild(bgStyle);
    }
}
