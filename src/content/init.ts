import {renderLayout} from './layout/renderLayout';
import {setIcon} from './setIcon';
import {setNav} from './setNav';
import {setStyles} from './setStyles';

export function init() {
    setStyles();
    renderLayout();
    setNav();
    setIcon();
}
