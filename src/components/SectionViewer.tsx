import { Section, Node, Explanation, Exercise } from "@/domain";
import { buildPageUrl } from "@/util";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NodeSymbolViewer from "./NodeSymbolViewer";



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
    return (
        <div className={`tile exercise ${exercise.judgement}`}>
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

function ErrorTile({ node } : { node: Node }) : JSX.Element
{
    return (
        <div className="tile error">
            {node.name}
        </div>
    );
}

function SectionViewer({ section } : { section: Section })
{
    const [ children, setChildren ] = useState<Node[]>([]);

    useEffect(() => {
        const func = async () => {
            const children = await section.getChildren();

            setChildren(children);
        };

        func();
    }, [section]);

    return (
        <div className="viewer section">
            <div className="tile-container">
                {
                    children.map(renderTile)
                }
            </div>
        </div>
    );


    function renderTile(child: Node): JSX.Element
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
