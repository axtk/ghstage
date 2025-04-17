import type {ContentConfig} from './ContentConfig';

export type BinConfig = Omit<ContentConfig, 'scriptSrc'> & {
    ghPagesBranch?: string;
    mainBranch?: string;
    remove?: boolean;
    cname?: string;
    jsorg?: boolean | string;
};
