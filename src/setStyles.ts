import {getBackground} from './getBackground';

const packageName = 'ghstage';

export function setStyles() {
    // let styles = document.querySelectorAll('link[rel="stylesheet"]');

    // for (let style of styles)
    //     style.remove();

    let script = document.querySelector<HTMLScriptElement>(
        `script[src*="/${packageName}@"], script[src*="/${packageName}/"]`
    );

    let scriptSrc = script?.getAttribute('src') ?? '';

    if (scriptSrc) {
        let style = document.createElement('link');

        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', scriptSrc.replace(/\.js$/, '.css'));

        document.head.appendChild(style);
    }

    let colorScheme = script?.dataset.colorScheme;

    if (colorScheme)
        document.documentElement.setAttribute('style', `--color-scheme: ${colorScheme}`);

    setTimeout(() => {
        let errSpans = document.querySelectorAll('pre .err');

        for (let errSpan of errSpans)
            errSpan.classList.remove('err');
    }, 0);

    let bgStyle = document.createElement('style');
    let bgSvg = window.btoa(getBackground());

    bgStyle.textContent = `html{background-image:url("data:image/svg+xml;base64,${bgSvg}");}`;

    document.body.appendChild(bgStyle);
}
