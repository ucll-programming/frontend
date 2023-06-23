import { Section, Node, Explanation, Exercise } from "@/domain";
import { buildPageUrl } from "@/util";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


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
            <table className="section-table">
                <tbody>
                    {
                        children.map(renderChild)
                    }
                </tbody>
            </table>
        </div>
    );


    function renderChild(child: Node): JSX.Element
    {
        if ( child.isSection() )
        {
            return renderSection(child);
        }
        else if ( child.isExercise() )
        {
            return renderExercise(child);
        }
        else if ( child.isExplanation() )
        {
            return renderExplanation(child);
        }
        else
        {
            console.log(`Error: unrecognized node`, child);
            throw new Error(`Unknown node ${child}`);
        }
    }

    function renderSection(section: Section): JSX.Element
    {
        return (
            <tr className="section">
                <td>
                    <Link to={buildPageUrl(section.treePath)}>{section.name}</Link>
                </td>
                <td />
            </tr>
        )
    }

    function renderExplanation(explanation: Explanation): JSX.Element
    {
        return (
            <tr className="explanation">
                <td>
                    <Link to={buildPageUrl(explanation.treePath)}>{explanation.name}</Link>
                </td>
                <td />
            </tr>
        )
    }

    function renderExercise(exercise: Exercise): JSX.Element
    {
        return (
            <tr className={determineClassName()}>
                <td>
                    <Link to={buildPageUrl(exercise.treePath)}>{exercise.name}</Link>
                </td>
                <td />
            </tr>
        )


        function determineClassName(): string
        {
            const result = [ 'exercise', exercise.judgement ];

            return result.join(' ');
        }
    }
}

export default SectionViewer;
