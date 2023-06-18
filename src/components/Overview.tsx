import { Exercise, Explanation, Node, Section, TreePath, useDomain } from '@/domain';
import { useActiveTreePath } from '@/main';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



function SectionViewer({ section }: { section: Section }): JSX.Element
{
    const [ children, setChildren ] = useState<Node[]>([]);
    const activeTreePath = useActiveTreePath();

    useEffect(() => section.addObserver(() => setChildren(section.children)), [section]);

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildUrl(section.treePath)}>
                    {section.name}
                </Link>
            </h1>
            <div className='section-children'>
                {children.map(child => <NodeViewer key={child.name} node={child} />)}
            </div>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = section.treePath.isEqualTo(activeTreePath);
        const isExpanded = section.treePath.isParentOf(activeTreePath);

        const result = ['overview-entry', 'section'];

        if ( isExpanded )
        {
            result.push('expanded');
        }
        else
        {
            result.push('collapsed');
        }

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
}

function ExplanationViewer({ explanation }: { explanation: Explanation }) : JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildUrl(explanation.treePath)}>
                    {explanation.name}
                </Link>
            </h1>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = explanation.treePath.isEqualTo(activeTreePath);

        const result = ['overview-entry', 'explanation'];

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
}

function ExerciseViewer({ exercise } : { exercise: Exercise }): JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildUrl(exercise.treePath)}>
                    {exercise.name}
                </Link>
            </h1>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = exercise.treePath.isEqualTo(activeTreePath);

        const result = ['overview-entry', 'exercise'];

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
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

function buildUrl(treePath: TreePath): string
{
    const partsUrl = treePath.parts.join('/')

    return `/nodes/${partsUrl}`;
}


export default Overview;
