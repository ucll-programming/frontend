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
    judgment_url: string,
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
    judgments: Record<string, Judgment>,
}

interface JudgmentFailure
{
    status: 'fail',
}

type JudgmentResponse = JudgmentSuccess | JudgmentFailure;

export async function fetchJudgment(url: string): Promise<Record<string, Judgment>>
{
    const response = await fetch(url);
    const data = await response.json() as JudgmentResponse;

    if ( data.status === 'ok' )
    {
        if ( !Object.values(data.judgments).every(judgment => ['pass', 'fail', 'unknown'].includes(judgment)) )
        {
            console.error(`Invalid judgment`, data.judgments);
        }

        return data.judgments;
    }
    else
    {
        console.error(`Failed to fetch judgment at ${url}`);
        throw new Error("Invalid url");
    }
}


interface RejudgeRequestResponse
{
    status: 'ok' | 'fail';
}

export async function requestRejudgement(url: string): Promise<RejudgeRequestResponse>
{
    const request: RequestInit = {
        method: 'POST',
    };

    const response = await fetch(url, request);
    const data = await response.json() as RejudgeRequestResponse;

    return data;
}
