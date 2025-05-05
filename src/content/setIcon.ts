import {getIcon} from '../utils/getIcon';
import {getSVGDataURL} from '../utils/getSVGDataURL';
import {getConfig} from './getConfig';

export function setIcon() {
    let icon = document.querySelector('link[rel="icon"]');

    if (icon) return;

    let {colorScheme} = getConfig();

    icon = document.createElement('link');

    icon.setAttribute('rel', 'icon');
    icon.setAttribute('href', getSVGDataURL(getIcon(colorScheme)));

    document.head.appendChild(icon);
}
