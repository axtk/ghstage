export {};

declare global {
    interface Window {
        sendHit: () => void;
    }
}
