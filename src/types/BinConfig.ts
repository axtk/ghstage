import type {Theme} from './Theme';

export type BinConfig = {
    colorScheme?: string;
    theme?: Theme;
    name?: string;
    description?: string;
    version?: string;
    repo?: string;
    npm?: string;
    /**
     * GitHub Pages branch
     * @default 'gh-pages'
     */
    ghPagesBranch?: string;
    /**
     * @default 'main'
     */
    mainBranch?: string;
    /**
     * @default 'x'
     */
    contentDir?: string;
    backstory?: string;
    /** Whether to remove the GitHub Pages branch and quit */
    remove?: boolean;
    /** Content of the './CNAME' file */
    cname?: string;
    /**
     * As a boolean, it means whether to add the
     * '<package_name>.js.org' domain to the './CNAME' file.
     *
     * As a string, it sets the '<jsorg_value>.js.org' domain
     * to the './CNAME' file.
     */
    jsorg?: boolean | string;
    ymid?: number | string;
};
