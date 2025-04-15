import type {ScriptConfig} from '../types/ScriptConfig';

const packageName = 'ghstage';

let config: ScriptConfig | null = null;

export function getConfig(): ScriptConfig {
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
