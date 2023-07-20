import { createContext, useContext } from "react";
import { ExerciseRestData, ExplanationRestData, Judgment, MaterialRestData, SectionRestData, NodeRestData, isSection, isExplanation, isExercise, fetchOverview, fetchJudgment as fetchJudgment } from "./rest";
import { Observable } from "./observable";


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


export abstract class ContentNode
{
    public constructor(public readonly name: string, public readonly treePath: TreePath)
    {
        this.predecessor = null;
        this.successor = null;
        this.parent = null;
    }

    public predecessor : ContentNode | null;

    public successor : ContentNode | null;

    public parent : ContentNode | null;

    public abstract isSection(): this is Section;

    public abstract isExercise(): this is Exercise;

    public abstract isExplanation(): this is Explanation;
}


export class Section extends ContentNode
{
    public constructor(name: string, treePath: TreePath, public readonly children: ContentNode[])
    {
        super(name, treePath);
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

    public findChild(part: string): ContentNode | undefined
    {
        for ( const child of this.children )
        {
            if ( child.treePath.lastPart === part )
            {
                return child;
            }
        }

        return undefined;
    }
}


abstract class LeafNode extends ContentNode
{
    public constructor(name: string, treePath: TreePath, protected readonly markdownUrl: string)
    {
        super(name, treePath);
    }

    public async markdown(): Promise<string>
    {
        // TODO Cache?
        const response = await fetch(this.markdownUrl);
        return response.text();
    }
}


export class Exercise extends LeafNode
{
    public judgment: Observable<Judgment>;

    public constructor(name: string, treePath: TreePath, public readonly difficulty: number, markdownUrl: string, private readonly judgmentUrl: string)
    {
        super(name, treePath, markdownUrl);

        this.judgment = new Observable<Judgment>("unknown");
        this.judge();
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

    public judge(): void
    {
        const performJudging = async () => {
            const judgment = await fetchJudgment(this.judgmentUrl);
            this.judgment.value = judgment;

            if ( judgment == 'unknown' )
            {
                setTimeout(() => performJudging(), 1000);
            }
        };

        performJudging();
    }
}


export class Explanation extends LeafNode
{
    public constructor(name: string, treePath: TreePath, markdownUrl: string)
    {
        super(name, treePath, markdownUrl);
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


function parseRestData(rawRoot: MaterialRestData): ContentNode
{
    const table = new Map<string, ContentNode>();
    const [root, delayed] = parse(rawRoot);
    delayed();
    return root;


    function linkNode(node: ContentNode, predecessorPath: string[] | null, successorPath: string[] | null, parentPath: string[] | null)
    {
        if ( predecessorPath !== null )
        {
            const predecessorPathString = predecessorPath.join('/');
            const predecessor = table.get(predecessorPathString);

            if ( !predecessor )
            {
                console.error(table.keys());
                console.error(`Unknown predecessor ${predecessorPathString}`);
            }
            else
            {
                node.predecessor = predecessor;
            }
        }

        if ( successorPath !== null )
        {
            const successorPathString = successorPath.join('/');
            const successor = table.get(successorPathString);

            if ( !successor )
            {
                console.error(`Unknown successor ${successorPathString}`);
            }
            else
            {
                node.successor = successor;
            }
        }

        if ( parentPath !== null )
        {
            const parentPathString = parentPath.join('/');
            const parent = table.get(parentPathString);

            if ( !parent )
            {
                console.error(`Unknown parent ${parentPathString}`);
            }
            else
            {
                node.parent = parent;
            }
        }
    }

    function parse(node: MaterialRestData): [ContentNode, () => void]
    {
        if ( isSection(node) )
        {
            const childResults = node.children.map(child => parse(child));
            const children = childResults.map(([child, _]) => child);
            const childDelayedFunctions = childResults.map(([_, callback]) => callback);
            const section = new Section(node.name, new TreePath(node.tree_path), children);
            const callback = () => {
                childDelayedFunctions.forEach(f => f());

                linkNode(section, node.predecessor, node.successor, node.parent);
            };

            table.set(section.treePath.toString(), section);
            return [section, callback];
        }
        else if ( isExercise(node) )
        {
            const exercise = new Exercise(
                node.name,
                new TreePath(node.tree_path),
                node.difficulty,
                node.markdown_url,
                node.judgment_url,
            );
            const delayed = () => linkNode(exercise, node.predecessor, node.successor, node.parent);

            table.set(exercise.treePath.toString(), exercise);
            return [exercise, delayed];
        }
        else if ( isExplanation(node) )
        {
            const explanation = new Explanation(
                node.name,
                new TreePath(node.tree_path),
                node.markdown_url,
            );
            const delayed = () => linkNode(explanation, node.predecessor, node.successor, node.parent);

            table.set(explanation.treePath.toString(), explanation);
            return [explanation, delayed];
        }
        else
        {
            throw new Error("Unknown node type");
        }
    }
}


export class Domain
{
    public constructor(public readonly root: ContentNode)
    {
        // NOP
    }

    public lookup(treePath: TreePath): ContentNode | undefined
    {
        let current: ContentNode = this.root;

        for ( const part of treePath.parts )
        {
            if ( current.isSection() )
            {
                const section = current;
                const child = section.findChild(part);

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


export async function loadDomain(): Promise<Domain>
{
    const data = await fetchOverview();
    const root = parseRestData(data);
    return new Domain(root);
}


export const DomainContext = createContext<Domain | null>(null);


export function useDomain(): Domain
{
    const domain = useContext(DomainContext);

    if ( !domain )
    {
        throw new Error("Bug: should never happen");
    }
    else
    {
        return domain;
    }
}
