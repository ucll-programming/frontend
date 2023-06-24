export type Judgement = 'pass' | 'fail' | 'unknown';

export interface NodeRestData
{
    name: string,
    tree_path: string[],
    successor_tree_path: string[] | null,
    predecessor_tree_path: string[] | null,
    parent_tree_path: string[] | null,
}

export interface SectionRestData extends NodeRestData
{
    type: 'section',
    children: string[],
}

export interface ExplanationRestData extends NodeRestData
{
    type: 'explanation',
    markdown: string,
}

export interface ExerciseRestData extends NodeRestData
{
    type: 'exercise',
    markdown: string,
    difficulty: number,
    judgement: Judgement,
}

export type MaterialNode = SectionRestData | ExplanationRestData | ExerciseRestData;


export function isSection(node: MaterialNode) : node is SectionRestData
{
    return node.type == 'section';
}

export function isExplanation(node: MaterialNode) : node is ExplanationRestData
{
    return node.type == 'explanation';
}

export function isExercise(node: MaterialNode) : node is ExerciseRestData
{
    return node.type == 'exercise';
}

export async function fetchNodeData(tree_path: string[]) : Promise<Response>
{
    const url = buildRestUrl(tree_path);
    const response = await fetch(url);

    return response;
}

export function buildRestUrl(tree_path: string[]) : string
{
    return `/api/v1/nodes/${tree_path.join("/")}`;
}
