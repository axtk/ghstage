import {packageName} from '../const/packageName';
import type {ContentConfig} from '../types/ContentConfig';

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
        scriptSrc: script.getAttribute('src') ?? undefined,
        colorScheme: props.colorScheme,
        theme: props.theme as ContentConfig['theme'],
        name: props.name,
        version: props.version,
        repo: props.repo,
        npm: props.npm,
    };

    return config;
}
