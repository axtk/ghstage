export function toFileContent(x: string) {
    let lines = x.split(/\r?\n/);
    let firstLine = lines.find(x => x.trim() !== '') ?? '';
    let tab = firstLine.match(/^\s+/)?.[0];

    if (!tab)
        return `${x.trim()}\n`;

    let tabPattern = new RegExp(`^${tab}`);

    return `${lines.map(s => s.replace(tabPattern, '')).join('\n').trim()}\n`;
}
