import {parseArgs} from 'args-json';
import type {BinConfig} from '../types/BinConfig';

let config: BinConfig | null = null;

export function getConfig(): BinConfig {
    if (config)
        return config;

    config = {
        ghPagesBranch: 'gh-pages',
        mainBranch: 'main',
        ...parseArgs<BinConfig>(process.argv.slice(2)),
    };

    return config;
}
