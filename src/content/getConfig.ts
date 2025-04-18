import {packageName} from '../const/packageName';
import type {ContentConfig} from '../types/ContentConfig';

function removeUnset<T extends Record<string, unknown>>(x: T): Partial<T> {
    let y: Partial<T> = {};

    for (let [k, v] of Object.entries(x)) {
        if (v !== null && v !== undefined)
            y[k as keyof T] = v as T[keyof T];
    }

    return y;
}

let config: ContentConfig | null = null;

export function getConfig(): ContentConfig {
    if (config)
        return config;

    let script = document.querySelector<HTMLScriptElement>(
        `script[src*="/${packageName}@"], script[src*="/${packageName}/"]`
    );

    if (!script)
        return {};

    let props = script.dataset;

    config = {
        ...window._ghst,
        ...removeUnset({
            scriptSrc: script.getAttribute('src') ?? undefined,
            colorScheme: props.colorScheme,
            theme: props.theme as ContentConfig['theme'],
            name: props.name,
            version: props.version,
            repo: props.repo,
            npm: props.npm,
        }),
    };

    return config;
}
