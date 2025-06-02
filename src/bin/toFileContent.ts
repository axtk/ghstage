export function toFileContent(x: string) {
    let lines = x.split(/\r?\n/);
    let firstLine = lines.find(x => x.trim() !== '') ?? '';
    let tab = firstLine.match(/^\s+/)?.[0];

    if (!tab) return `${x.trim()}\n`;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(tab))
            lines[i] = lines[i].slice(tab.length);
    }

    return `${lines.join('\n').trim()}\n`;
}
