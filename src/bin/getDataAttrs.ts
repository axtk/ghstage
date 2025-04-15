export function getDataAttrs(attrs: Record<string, string | undefined>) {
    return Object.entries(attrs)
        .map(([name, value]) => value ? ` data-${name}="${value}"` : '')
        .filter(item => item !== '')
        .join(' ');
}
