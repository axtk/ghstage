import {getIcon} from './getIcon';
import {getSVGDataURL} from './getSVGDataURL';

export function setIcon() {
    let icon = document.querySelector('link[rel="icon"]');

    if (icon)
        return;

    icon = document.createElement('link');

    icon.setAttribute('rel', 'icon');
    icon.setAttribute('href', getSVGDataURL(getIcon()));

    document.head.appendChild(icon);
}
