export type PackageMetadata = {
    name?: string;
    version?: string;
    repository?: string | {
        type?: string;
        url?: string;
    };
};
