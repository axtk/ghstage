import {parseArgs} from 'args-json';
import type {ArgConfig} from '../types/ArgConfig';

let config: ArgConfig | null = null;

export function getConfig(): ArgConfig {
    if (config)
        return config;

    config = {
        ghPagesBranch: 'gh-pages',
        mainBranch: 'main',
        ...parseArgs<ArgConfig>(process.argv.slice(2)),
    };

    return config;
}
