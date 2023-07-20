import { createContext, useContext } from "react";
import { MaterialRestData, fetchOverview, isExercise, isExplanation, isSection } from "@/rest";
import { TreePath } from '@/domain/treepath';
import { ContentNode, Explanation, Exercise, Section } from '@/domain/content-tree';


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
