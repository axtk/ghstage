import {getConfig} from '../getConfig';

export function getRepoLink() {
    let {repo} = getConfig();

    if (!repo) return null;

    let link = document.createElement('a');

    link.href = repo;
    link.textContent = /\bgithub\.com\//.test(repo) ? 'GitHub' : 'Repository';
    link.target = '_blank';

    return link;
}
