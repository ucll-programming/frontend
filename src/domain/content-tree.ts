import { TreePath } from '@/domain';
import { Observable } from "@/observable";
import { Judgment, fetchJudgment, requestRejudgement } from "@/rest";


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

    public abstract judge(): void;

    public abstract updateJudgment(judgments: Record<string, Judgment>): void;
}


export class Section extends ContentNode
{
    public constructor(name: string, treePath: TreePath, public readonly children: ContentNode[], public readonly judgmentUrl: string)
    {
        super(name, treePath);
    }

    public override isExercise(): this is Exercise
    {
        return false;
    }

    public override isExplanation(): this is Explanation
    {
        return false;
    }

    public override isSection(): this is Section
    {
        return true;
    }

    public findChild(part: string): ContentNode
    {
        for ( const child of this.children )
        {
            if ( child.treePath.lastPart === part )
            {
                return child;
            }
        }

        throw new Error(`Could not find child ${part}`);
    }

    public override judge(): void
    {
        const performJudging = async () => {
            const judgments = await fetchJudgment(this.judgmentUrl);

            this.updateJudgment(judgments);
        };

        performJudging();
    }

    public override updateJudgment( judgments: Record<string, Judgment> ): void
    {
        for ( const child of this.children )
        {
            child.updateJudgment(judgments);
        }
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
    }

    public override isExercise(): this is Exercise
    {
        return true;
    }

    public override isExplanation(): this is Explanation
    {
        return false;
    }

    public override isSection(): this is Section
    {
        return false;
    }

    public judge(): void
    {
        const performJudging = async () => {
            const judgments = await fetchJudgment(this.judgmentUrl);
            const treePathString = this.treePath.toString();

            if ( treePathString in judgments )
            {
                const judgment = judgments[treePathString];
                this.judgment.value = judgment;

                if ( judgment === 'unknown' )
                {
                    setTimeout(() => performJudging(), 1000);
                }
            }
            else
            {
                console.error(`Unexpected error: ${treePathString} not found in judgments object`, judgments);
            }
        };

        performJudging();
    }

    public rejudge(): void
    {
        const performRejudging = async () => {
            await requestRejudgement(this.judgmentUrl);
            this.judge();
        }

        performRejudging();
    }

    public override updateJudgment( judgments: Record<string, Judgment> ): void
    {
        const treePathString = this.treePath.toString();

        if ( treePathString in judgments )
        {
            this.judgment.value = judgments[treePathString];
        }
    }
}


export class Explanation extends LeafNode
{
    public constructor(name: string, treePath: TreePath, markdownUrl: string)
    {
        super(name, treePath, markdownUrl);
    }

    public override isExercise(): this is Exercise
    {
        return false;
    }

    public override isExplanation(): this is Explanation
    {
        return true;
    }

    public override isSection(): this is Section
    {
        return false;
    }

    public override judge(): void
    {
        // NOP
    }

    public override updateJudgment( judgments: Record<string, Judgment> ): void
    {
        // NOP
    }
}