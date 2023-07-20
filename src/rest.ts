export type Judgment = 'pass' | 'fail' | 'unknown';

export interface NodeRestData
{
    name: string,
    tree_path: string[],
    successor: string[] | null,
    predecessor: string[] | null,
    parent: string[] | null,
}

export interface SectionRestData extends NodeRestData
{
    type: 'section',
    children: MaterialRestData[],
}

export interface LeafRestData extends NodeRestData
{
    markdown_url: string,
}

export interface ExplanationRestData extends LeafRestData
{
    type: 'explanation',

}

export interface ExerciseRestData extends LeafRestData
{
    type: 'exercise',
    markdown_url: string,
    difficulty: number,
    judgment_url: string,
}

export type MaterialRestData = SectionRestData | ExplanationRestData | ExerciseRestData;

export function isSection(node: MaterialRestData): node is SectionRestData
{
    return node.type == 'section';
}

export function isExplanation(node: MaterialRestData): node is ExplanationRestData
{
    return node.type == 'explanation';
}

export function isExercise(node: MaterialRestData): node is ExerciseRestData
{
    return node.type == 'exercise';
}

export async function fetchOverview(): Promise<MaterialRestData>
{
    const url = '/api/v1/overview';
    const response = await fetch(url);
    const data = await response.json() as MaterialRestData;

    return data;
}

interface JudgmentSuccess
{
    status: 'ok',
    judgment: Judgment,
}

interface JudgmentFailure
{
    status: 'fail',
}

type JudgmentResponse = JudgmentSuccess | JudgmentFailure;

export async function fetchJudgment(url: string): Promise<Judgment>
{
    const response = await fetch(url);
    const data = await response.json() as JudgmentResponse;

    if ( data.status === 'ok' )
    {
        return data.judgment;
    }
    else
    {
        console.error(`Failed to fetch ${url}`);
        return 'unknown';
    }
}