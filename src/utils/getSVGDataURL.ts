export function getSVGDataURL(svg: string) {
    return `data:image/svg+xml;base64,${window.btoa(svg)}`;
}
