import { createContext, useContext } from "react";
import { Observable } from "@/observable";
import { Judgment, MaterialRestData, fetchJudgment, requestRejudgement } from "@/rest";
import { TreePath } from '@/domain';


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
}


export class Section extends ContentNode
{
    public constructor(name: string, treePath: TreePath, public readonly children: ContentNode[])
    {
        super(name, treePath);
    }

    public isExercise(): this is Exercise
    {
        return false;
    }

    public isExplanation(): this is Explanation
    {
        return false;
    }

    public isSection(): this is Section
    {
        return true;
    }

    public findChild(part: string): ContentNode | undefined
    {
        for ( const child of this.children )
        {
            if ( child.treePath.lastPart === part )
            {
                return child;
            }
        }

        return undefined;
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
        this.judge();
    }

    public isExercise(): this is Exercise
    {
        return true;
    }

    public isExplanation(): this is Explanation
    {
        return false;
    }

    public isSection(): this is Section
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
}


export class Explanation extends LeafNode
{
    public constructor(name: string, treePath: TreePath, markdownUrl: string)
    {
        super(name, treePath, markdownUrl);
    }

    public isExercise(): this is Exercise
    {
        return false;
    }

    public isExplanation(): this is Explanation
    {
        return true;
    }

    public isSection(): this is Section
    {
        return false;
    }
}