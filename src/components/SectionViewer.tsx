import { Section, ContentNode, Explanation, Exercise } from "@/domain";
import { buildPageUrl } from "@/util";
import { Link } from "react-router-dom";
import NodeSymbolViewer from "./NodeSymbolViewer";
import React from "react";
import { Judgement } from "@/rest";



function SectionTile({ section } : { section: Section }): JSX.Element
{
    return (
        <div className="tile section">
            <NodeSymbolViewer node={section} />
            <Link to={buildPageUrl(section.treePath)} className="caption-container">
                <span className="caption">
                    {section.name}
                </span>
            </Link>
        </div>
    );
}

function ExerciseTile({ exercise } : { exercise: Exercise }): JSX.Element
{
    const [ judgement, setJudgement ] = React.useState<Judgement>('unknown');

    React.useEffect(() => {
        const func = async () => {
            const judgement = await exercise.judgement();
            setJudgement(judgement);

            if ( judgement === 'unknown' )
            {
                setTimeout(func, 1);
            }
        };

        func();
    }, [ exercise ]);

    return (
        <div className={`tile exercise ${judgement}`}>
            <div className="symbol">
                <NodeSymbolViewer node={exercise} />
            </div>
            <Link to={buildPageUrl(exercise.treePath)} className="caption-container">
                <span className="caption">
                    {exercise.name}
                </span>
            </Link>
        </div>
    );
}

function ExplanationTile({ explanation } : { explanation: Explanation }): JSX.Element
{
    return (
        <div className="tile explanation">
            <div className="symbol">
                <NodeSymbolViewer node={explanation} />
            </div>
            <Link to={buildPageUrl(explanation.treePath)} className="caption-container">
                <span className="caption">
                    {explanation.name}
                </span>
            </Link>
        </div>
    );
}

function ErrorTile({ node } : { node: ContentNode }) : JSX.Element
{
    return (
        <div className="tile error">
            {node.name}
        </div>
    );
}

function SectionViewer({ section } : { section: Section })
{
    const children = section.children;

    return (
        <div className="viewer section">
            <div className="tile-container">
                {
                    children.map(renderTile)
                }
            </div>
        </div>
    );


    function renderTile(child: ContentNode): JSX.Element
    {
        if ( child.isSection() )
        {
            return (
                <SectionTile section={child} />
            );
        }
        else if ( child.isExercise() )
        {
            return (
                <ExerciseTile exercise={child} />
            );
        }
        else if ( child.isExplanation() )
        {
            return (
                <ExplanationTile explanation={child} />
            );
        }
        else
        {
            console.error(`Unrecognized node`, child);

            return (
                <ErrorTile node={child} />
            );
        }
    }
}

export default SectionViewer;
