import {init} from './src/content/init';

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
else init();
