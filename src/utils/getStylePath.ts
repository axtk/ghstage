import type {Theme} from '../types/Theme';

const themeFileMap: Record<NonNullable<Theme>, string> = {
    none: 'index',
};

export function getStylePath(theme: Theme) {
    return `/styles/${themeFileMap[theme ?? 'none'] ?? themeFileMap.none}.css`;
}
