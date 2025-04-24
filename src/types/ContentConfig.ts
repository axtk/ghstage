import type {Theme} from './Theme';

export type ContentConfig = {
    scriptSrc?: string;
    colorScheme?: string;
    theme?: Theme;
    name?: string;
    version?: string;
    repo?: string;
    npm?: string;
};
