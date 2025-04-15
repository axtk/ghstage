const packageName = 'ghstage';

export type Config = {
    scriptSrc?: string;
    colorScheme?: string;
    repo?: string;
    npm?: string;
};

let config: Config | null = null;

export function getConfig(): Config {
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
