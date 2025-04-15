import type {ScriptConfig} from './ScriptConfig';

export type ArgConfig = Omit<ScriptConfig, 'scriptSrc'> & {
    ghPagesBranch?: string;
    mainBranch?: string;
};
