import { TreePath } from '@/domain';


export function isString(x: any) : x is string
{
    return typeof x === 'string';
}


export function capitalize(s: string) : string
{
    if ( s.length === 0 )
    {
        return s;
    }

    const firstLetter = s[0].toUpperCase();
    const rest = s.slice(1).toLowerCase();

    return `${firstLetter}${rest}`;
}

export function buildPageUrl(treePath: TreePath): string
{
    const partsUrl = treePath.parts.join('/')

    return `/nodes/${partsUrl}`;
}