import { createContext, useContext } from "react";
import { ExerciseData, ExplanationData, MaterialNode as NodeData, SectionData, fetchNodeData } from "./rest";


export class TreePath
{
    public constructor(public readonly parts: string[])
    {
        // NOP
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


export abstract class Node
{
    public constructor()
    {
        // NOP
    }

    public get name(): string
    {
        return this.data.name;
    }

    public get path(): string
    {
        return this.data.path;
    }

    public get treePath(): TreePath
    {
        return new TreePath(this.data.tree_path);
    }

    protected abstract get data(): NodeData;

    public abstract isSection(): this is Section;

    public abstract isExercise(): this is Exercise;

    public abstract isExplanation(): this is Explanation;
}


export class Section extends Node
{
    private children: Node[] | undefined;

    private resolvers: ((children: Node[]) => void)[];

    public constructor(protected data: SectionData)
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

    public async getChildren(): Promise<Node[]>
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

    public async lookup(part: string): Promise<Node | undefined>
    {
        const children = await this.getChildren();

        return children.find(c => c.treePath.parts[c.treePath.parts.length-1] === part);
    }
}


export class Exercise extends Node
{
    public constructor(protected data: ExerciseData)
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
}


export class Explanation extends Node
{
    public constructor(protected data: ExplanationData)
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


export async function createNodeFromTreePath(tree_path: string[]): Promise<Node>
{
    const response = await fetchNodeData(tree_path);
    const data = await response.json() as NodeData;

    return createNodeFromData(data);
}


export function createDummyNode(): Node
{
    const data: SectionData = {
        type: 'section',
        tree_path: [],
        children: [],
        path: 'DUMMY PATH',
        name: 'DUMMY',
    }

    return createNodeFromData(data);
}


export function createNodeFromData(data: NodeData): Node
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
    // private lookupTable: { [key: string]: Node };

    public constructor(public readonly root: Node)
    {
        // this.lookupTable = Domain.buildTable(root);
    }

    // private static buildTable(root: Node): { [key: string]: Node }
    // {
    //     const result: { [key: string]: Node } = {};
    //     recurse(root);
    //     return result;

    //     function recurse(node: Node)
    //     {
    //         result[node.treePath.toString()] = node;

    //         if ( node.isSection() )
    //         {
    //             const section = node;

    //             for ( const child of section.children )
    //             {
    //                 recurse(child);
    //             }
    //         }
    //     }
    // }

    public async lookup(treePath: TreePath): Promise<Node | undefined>
    {
        let current: Node = this.root;

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
