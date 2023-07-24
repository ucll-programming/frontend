export class TreePath
{
    public constructor(public readonly parts: string[])
    {
        if ( parts === undefined )
        {
            throw new Error("Bug");
        }
    }

    public static parse(s: string): TreePath
    {
        const parts = s.split('/');

        return new TreePath(parts);
    }

    public add(part: string): TreePath
    {
        return new TreePath([...this.parts, part]);
    }

    public get length(): number
    {
        return this.parts.length;
    }

    public get lastPart(): string
    {
        return this.parts[this.length - 1];
    }

    public isParentOf(treePath: TreePath): boolean
    {
        if ( this.length > treePath.length )
        {
            return false;
        }
        else
        {
            return this.parts.every((part, index) => part === treePath.parts[index]);
        }
    }

    public isEqualTo(treePath: TreePath): boolean
    {
        if ( this.length !== treePath.length )
        {
            return false;
        }
        else
        {
            return this.parts.every((part, index) => part === treePath.parts[index]);
        }
    }

    public toString(): string
    {
        return this.parts.join('/');
    }
}
