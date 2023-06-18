import { ExerciseData, ExplanationData, MaterialNode, SectionData, fetchNodeData } from "./rest";


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
}


export abstract class Node
{
    private _observers: (() => void)[];

    public constructor()
    {
        this._observers = [];
    }

    public addObserver(observer: () => void): void
    {
        this._observers.push(observer);
    }

    protected notifyObservers(): void
    {
        this._observers.forEach(observer => observer());
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

    protected abstract get data(): MaterialNode;

    public abstract isSection(): this is Section;

    public abstract isExercise(): this is Exercise;

    public abstract isExplanation(): this is Explanation;
}


export class Section extends Node
{
    public children: Node[];

    public constructor(protected data: SectionData)
    {
        super();

        if ( data.type !== 'section' )
        {
            throw new Error('data should have type section')
        }

        this.children = [];
        this.fetchData();
    }

    private async fetchData(): Promise<void>
    {
        const promises = this.data.children.map(child => createNodeFromTreePath([...this.data.tree_path, child]));
        this.children = await Promise.all(promises);

        this.notifyObservers();
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
}


export async function createNodeFromTreePath(tree_path: string[]): Promise<Node>
{
    const response = await fetchNodeData(tree_path);
    const data = await response.json() as MaterialNode;

    return createNodeFromData(data);
}


export function createNodeFromData(data: MaterialNode): Node
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