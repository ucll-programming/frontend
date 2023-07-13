export type Judgement = 'pass' | 'fail' | 'unknown';

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
    judgement_url: string,
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

interface JudgementSuccess
{
    status: 'ok',
    judgement: Judgement,
}

interface JudgementFailure
{
    status: 'fail',
}

type JudgementResponse = JudgementSuccess | JudgementFailure;

export async function fetchJudgement(url: string): Promise<Judgement>
{
    const response = await fetch(url);
    const data = await response.json() as JudgementResponse;

    if ( data.status === 'ok' )
    {
        return data.judgement;
    }
    else
    {
        console.error(`Failed to fetch ${url}`);
        return 'unknown';
    }
}