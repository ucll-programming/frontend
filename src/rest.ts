export interface Section {
    type: 'section',
    path: string,
    name: string,
    tree_path: string[],
    children: string[],
}

export interface Explanation {
    type: 'explanation',
    path: string,
    tree_path: string[],
}

export interface Exercise {
    type: 'exercise',
    path: string,
    tree_path: string[],
}

export type MaterialNode = Section | Explanation | Exercise;


export function isSection(node: MaterialNode) : node is Section
{
    return node.type == 'section';
}

export function isExplanation(node: MaterialNode) : node is Explanation
{
    return node.type == 'explanation';
}

export function isExercise(node: MaterialNode) : node is Exercise
{
    return node.type == 'exercise';
}

export async function fetchNodeData(tree_path: string[]) : Promise<Response>
{
    const url = buildNodeUrl(tree_path);

    return await fetch(url);
}

export function buildNodeUrl(tree_path: string[]) : string
{
    return `/api/v1/nodes/${tree_path.join("/")}`;
}
