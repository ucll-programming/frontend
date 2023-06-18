import { Exercise, Explanation, Node, Section } from '@/domain';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function SectionViewer({ section }: { section: Section }): JSX.Element
{
    const [ children, setChildren ] = useState<Node[]>([]);

    section.addObserver(() => setChildren(section.children));

    return (
        <div className='overview-entry section'>
            <h1>{section.name}</h1>
            <div className='section-children'>
                {children.map(child => <NodeViewer key={child.name} node={child} />)}
            </div>
        </div>
    );
}

function ExplanationViewer(props: { explanation: Explanation }) : JSX.Element
{
    return (
        <div>
            {props.explanation.name}
        </div>
    );
}

function ExerciseViewer(props: { exercise: Exercise }): JSX.Element
{
    return (
        <div>
            {props.exercise.name}
        </div>
    );
}

function ErrorViewer(props: { node: Node }): JSX.Element
{
    return (
        <div>
            ERROR
        </div>
    );
}

function NodeViewer(props: { node: Node }): JSX.Element
{
    if ( props.node.isExercise() )
    {
        return <ExerciseViewer exercise={props.node} />;
    }
    else if ( props.node.isExplanation() )
    {
        return <ExplanationViewer explanation={props.node} />;
    }
    else if ( props.node.isSection() )
    {
        return <SectionViewer section={props.node} />;
    }
    else
    {
        return <ErrorViewer node={props.node} />;
    }
}

function Overview(props: { root: Node }): JSX.Element
{
    const [topLevelNodes, setTopLevelNodes] = useState<Node[]>([]);

    props.root.addObserver(() => {
        if (props.root.isSection())
        {
            setTopLevelNodes(props.root.children)
        }
        else
        {
            setTopLevelNodes([props.root]);
        }
    });


    return (
        <div className="overview-root-container">
            {
                topLevelNodes.map(node => <NodeViewer key={node.name} node={node} />)
            }
        </div>
    );
}


export default Overview;