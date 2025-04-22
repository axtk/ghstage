import {renderLayout} from './layout/renderLayout';
import {setExternalLinks} from './setExternalLinks';
import {setIcon} from './setIcon';
import {setNav} from './setNav';
import {setStyles} from './setStyles';

export function init() {
    setStyles();
    renderLayout();
    setNav();
    setIcon();

    requestAnimationFrame(() => {
        setExternalLinks();
    });
}
