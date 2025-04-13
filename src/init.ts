import {renderLayout} from './layout/renderLayout';
import {setNav} from './setNav';
import {setStyles} from './setStyles';

export function init() {
    setStyles();
    renderLayout();
    setNav();
}
