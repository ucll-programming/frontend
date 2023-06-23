export type Judgement = 'pass' | 'fail' | 'unknown';

export interface NodeBase
{
    path: string,
    name: string,
}

export interface SectionData extends NodeBase
{
    type: 'section',
    tree_path: string[],
    children: string[],
}

export interface ExplanationData extends NodeBase
{
    type: 'explanation',
    path: string,
    tree_path: string[],
    markdown: string,
}

export interface ExerciseData extends NodeBase
{
    type: 'exercise',
    path: string,
    tree_path: string[],
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
    const url = buildNodeUrl(tree_path);
    const response = await fetch(url);

    return response;
}

export function buildNodeUrl(tree_path: string[]) : string
{
    return `/api/v1/nodes/${tree_path.join("/")}`;
}
