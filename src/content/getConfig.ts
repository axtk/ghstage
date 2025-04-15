import type {ContentConfig} from '../types/ContentConfig';

const packageName = 'ghstage';

let config: ContentConfig | null = null;

export function getConfig(): ContentConfig {
    if (config)
        return config;

    let script = document.querySelector<HTMLScriptElement>(
        `script[src*="/${packageName}@"], script[src*="/${packageName}/"]`
    );

    if (!script)
        return {};

    config = {
        scriptSrc: script.getAttribute('src') ?? undefined,
        colorScheme: script.dataset.colorScheme,
        repo: script.dataset.repo,
        npm: script.dataset.npm,
    };

    return config;
}
