export function getInstallationCode(element: Element) {
    if (!element.matches('p')) return;

    let code = element.querySelector('code');

    if (!code) return;

    if (!/^npm (i|install)\b/.test(code.textContent ?? '')) return;

    return code;
}
