import type {ContentConfig} from './ContentConfig';

declare global {
    interface Window {
        _ghst?: Omit<ContentConfig, 'scriptSrc'>;
        sendHit?: () => void;
    }
}
