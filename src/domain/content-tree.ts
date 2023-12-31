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
    private readonly childMap: Record<string, ContentNode>;

    public constructor(name: string, treePath: TreePath, children: ContentNode[], public readonly judgmentUrl: string)
    {
        super(name, treePath);

        this.childMap = {};
        for ( const child of children )
        {
            if ( !this.treePath.isParentOf(child.treePath) )
            {
                throw new Error(`Child's tree path is not extension of parent's tree path`);
            }

            const extraPart = child.treePath.parts[this.treePath.length];

            this.childMap[extraPart] = child;
        }
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
        if ( !(part in this.childMap) )
        {
            throw new Error(`Could not find child ${part}`);
        }

        return this.childMap[part];
    }

    public override judge(): void
    {
        const performJudging = async () => {
            const judgments = await fetchJudgment(this.judgmentUrl);

            this.updateJudgment(judgments);
        };

        performJudging();
    }

    public get children(): ContentNode[]
    {
        return Object.values(this.childMap);
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
                    this.delayedJudge();
                }
            }
            else
            {
                console.error(`Unexpected error: ${treePathString} not found in judgments object`, judgments);
            }
        };

        performJudging();
    }

    private delayedJudge()
    {
        setTimeout(() => this.judge(), 1000);
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
            const judgment = judgments[treePathString];
            this.judgment.value = judgment;

            if ( judgment === 'unknown' )
            {
                this.delayedJudge();
            }
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