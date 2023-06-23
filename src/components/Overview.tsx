import { Exercise, Explanation, Node, Section, TreePath } from '@/domain';
import { useActiveTreePath } from '@/main';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as icons from '@primer/octicons-react';
import DifficultyViewer from './DifficultyViewer';
import { buildPageUrl as buildNodeUrl } from '@/util';
import NodeSymbolViewer from './NodeSymbolViewer';


function SectionViewer({ section }: { section: Section }): JSX.Element
{
    const [ children, setChildren ] = useState<Node[]>([]);
    const activeTreePath = useActiveTreePath();

    useEffect(() => {
        const func = async () => {
            const children = await section.getChildren();

            setChildren(children);
        };

        func();
    }, [section]);

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildNodeUrl(section.treePath)}>
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


interface LeafProps
{
    caption: string,
    symbol: JSX.Element,
    classNames: string[],
    treePath: TreePath,
}

function LeafViewer({ caption, symbol, classNames, treePath } : LeafProps): JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildNodeUrl(treePath)}>
                    <span className='overview-entry-header-label'>
                        {caption}
                    </span>
                    <span className='overview-entry-header-symbol'>
                        {symbol}
                    </span>
                </Link>
            </h1>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = treePath.isEqualTo(activeTreePath);
        const result = [ 'overview-entry', ...classNames ];

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
}


function ExplanationViewer({ explanation }: { explanation: Explanation }): JSX.Element
{
    return (
        <LeafViewer
            caption={explanation.name}
            symbol={<NodeSymbolViewer node={explanation} />}
            classNames={['explanation']}
            treePath={explanation.treePath} />
    );
}

function ExerciseViewer({ exercise } : { exercise: Exercise }): JSX.Element
{
    const classNames = [ 'exercise', exercise.judgement ];

    return (
        <LeafViewer
            caption={exercise.name}
            symbol={<NodeSymbolViewer node={exercise} />}
            classNames={classNames}
            treePath={exercise.treePath} />
    );
}

function ErrorViewer(props: { node: Node }): JSX.Element
{
    return (
        <div>
            ERROR: Don't know what to do with {props.node.path}
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

function Overview({ root }: { root: Node }): JSX.Element
{
    const [topLevelNodes, setTopLevelNodes] = useState<Node[]>([]);

    useEffect(() => {
        const func = async () => {
            if ( root.isSection() )
            {
                const children = await root.getChildren();
                setTopLevelNodes(children);
            }
            else
            {
                setTopLevelNodes([root]);
            }
        };

        func();
    }, [ root ]);


    return (
        <div className="overview-root-container">
            {
                topLevelNodes.map(node => <NodeViewer key={node.name} node={node} />)
            }
        </div>
    );
}


export default Overview;
