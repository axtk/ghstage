import type {ContentConfig} from './ContentConfig';

export type BinConfig = Omit<ContentConfig, 'scriptSrc'> & {
    /** GitHub Pages branch */
    ghPagesBranch?: string;
    mainBranch?: string;
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
};
