import { escapeHTML } from "../utils/escapeHTML";
import { getConfig } from "./getConfig";

type GetTitleParams = {
  originalContent?: string;
  withPackageURL?: boolean;
};

export async function getTitle({
  originalContent,
  withPackageURL,
}: GetTitleParams = {}) {
  let { rootPath, name, scope } = await getConfig();

  if (originalContent && originalContent.trim() !== name)
    return originalContent;

  let scopeMatches = name?.match(/^(@[^/]+)\/?(.*)/);

  if (!scope || !scopeMatches) {
    let escapedName = escapeHTML(name);

    return withPackageURL
      ? `<a href="${rootPath}" class="name">${escapedName}</a>`
      : `<span class="name">${escapedName}</span>`;
  }

  let title =
    `<a href="${scope}" class="scope">${scopeMatches[1]}</a>` +
    '<span class="sep">/</span>';

  title += withPackageURL
    ? `<a href="${rootPath}" class="name">${scopeMatches[2]}</a>`
    : `<span class="name">${scopeMatches[2]}</span>`;

  return title;
}
