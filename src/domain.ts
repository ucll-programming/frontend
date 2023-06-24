import { createContext, useContext } from "react";
import { ExerciseRestData, ExplanationRestData, Judgement, MaterialRestData, SectionRestData, fetchNodeData } from "./rest";


export class TreePath
{
    public constructor(public readonly parts: string[])
    {
        if ( parts === undefined )
        {
            throw new Error("Bug");
        }
    }

    public add(part: string): TreePath
    {
        return new TreePath([...this.parts, part]);
    }

    public get length(): number
    {
        return this.parts.length;
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


export abstract class ContentNode
{
    public constructor()
    {
        // NOP
    }

    public get name(): string
    {
        return this.data.name;
    }

    public get treePath(): TreePath
    {
        return new TreePath(this.data.tree_path);
    }

    public get successorTreePath(): TreePath | null
    {
        return this.makeTreePath(this.data.successor_tree_path);
    }

    public get predecessorTreePath(): TreePath | null
    {
        return this.makeTreePath(this.data.predecessor_tree_path);
    }

    public get parentTreePath(): TreePath | null
    {
        return this.makeTreePath(this.data.parent_tree_path);
    }

    private makeTreePath(path: string[] | null) : TreePath | null
    {
        if ( path !== null )
        {
            return new TreePath(path);
        }
        else
        {
            return null;
        }
    }

    protected abstract get data(): MaterialRestData;

    public abstract isSection(): this is Section;

    public abstract isExercise(): this is Exercise;

    public abstract isExplanation(): this is Explanation;
}


export class Section extends ContentNode
{
    private children: ContentNode[] | undefined;

    private resolvers: ((children: ContentNode[]) => void)[];

    public constructor(protected data: SectionRestData)
    {
        super();

        if ( data.type !== 'section' )
        {
            throw new Error('data should have type section')
        }

        this.children = undefined;
        this.resolvers = [];
        this.fetchData();
    }

    public async getChildren(): Promise<ContentNode[]>
    {
        if ( this.children === undefined )
        {
            return new Promise(resolve => this.resolvers.push(resolve));
        }
        else
        {
            return this.children;
        }
    }

    private async fetchData(): Promise<void>
    {
        const promises = this.data.children.map(child => createNodeFromTreePath([...this.data.tree_path, child]));
        const children = await Promise.all(promises);

        this.children = children;
        this.resolvers.forEach(resolver => resolver(children));
        this.resolvers = [];
    }

    public isExercise(): this is Exercise
    {
        return false;
    }

    public isExplanation(): this is Explanation
    {
        return false;
    }

    public isSection(): this is Section
    {
        return true;
    }

    public async lookup(part: string): Promise<ContentNode | undefined>
    {
        const children = await this.getChildren();

        return children.find(c => c.treePath.parts[c.treePath.parts.length-1] === part);
    }
}


export class Exercise extends ContentNode
{
    public constructor(protected data: ExerciseRestData)
    {
        super();

        if ( data.type !== 'exercise' )
        {
            throw new Error('data should have type exercise')
        }
    }

    public isExercise(): this is Exercise
    {
        return true;
    }

    public isExplanation(): this is Explanation
    {
        return false;
    }

    public isSection(): this is Section
    {
        return false;
    }

    public get markdown(): string
    {
        return this.data.markdown;
    }

    public get difficulty(): number
    {
        return this.data.difficulty;
    }

    public get judgement(): Judgement
    {
        return this.data.judgement;
    }
}


export class Explanation extends ContentNode
{
    public constructor(protected data: ExplanationRestData)
    {
        super();

        if ( data.type !== 'explanation' )
        {
            throw new Error('data should have type explanation')
        }
    }

    public isExercise(): this is Exercise
    {
        return false;
    }

    public isExplanation(): this is Explanation
    {
        return true;
    }

    public isSection(): this is Section
    {
        return false;
    }

    public get markdown(): string
    {
        return this.data.markdown;
    }
}


export async function createNodeFromTreePath(tree_path: string[]): Promise<ContentNode>
{
    const response = await fetchNodeData(tree_path);
    const data = await response.json() as MaterialRestData;

    return createNodeFromData(data);
}


export function createDummyNode(): ContentNode
{
    const data: SectionRestData = {
        type: 'section',
        tree_path: [],
        children: [],
        name: 'DUMMY',
        successor_tree_path: null,
        predecessor_tree_path: null,
        parent_tree_path: null,
    }

    return createNodeFromData(data);
}


export function createNodeFromData(data: MaterialRestData): ContentNode
{
    switch ( data.type )
    {
        case "exercise":
            return new Exercise(data);
        case "explanation":
            return new Explanation(data);
        case "section":
            return new Section(data);
    }
}


export class Domain
{
    public constructor(public readonly root: ContentNode)
    {
        // NOP
    }

    public async lookup(treePath: TreePath): Promise<ContentNode | undefined>
    {
        let current: ContentNode = this.root;

        for ( const part of treePath.parts )
        {
            if ( current.isSection() )
            {
                const section = current;
                const child = await section.lookup(part);

                if ( child === undefined )
                {
                    return undefined;
                }
                else
                {
                    current = child;
                }
            }
            else
            {
                return undefined;
            }
        }

        return current;
    }
}


export const DomainContext = createContext<Domain>(new Domain(createDummyNode()));


export function useDomain()
{
    return useContext(DomainContext);
}
