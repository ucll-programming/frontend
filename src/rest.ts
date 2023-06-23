export type Judgement = 'pass' | 'fail' | 'unknown';

export interface NodeBase
{
    name: string,
    tree_path: string[],
    successor_tree_path: string[] | null,
    predecessor_tree_path: string[] | null,
    parent_tree_path: string[] | null,
}

export interface SectionData extends NodeBase
{
    type: 'section',
    children: string[],
}

export interface ExplanationData extends NodeBase
{
    type: 'explanation',
    markdown: string,
}

export interface ExerciseData extends NodeBase
{
    type: 'exercise',
    markdown: string,
    difficulty: number,
    judgement: Judgement,
}

export type MaterialNode = SectionData | ExplanationData | ExerciseData;


export function isSection(node: MaterialNode) : node is SectionData
{
    return node.type == 'section';
}

export function isExplanation(node: MaterialNode) : node is ExplanationData
{
    return node.type == 'explanation';
}

export function isExercise(node: MaterialNode) : node is ExerciseData
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
