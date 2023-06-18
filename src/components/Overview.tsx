import { Exercise, Explanation, Node, Section, TreePath } from '@/domain';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';


interface OverviewData
{
    selectedTreePath: TreePath,
    setSelectedTreePath: (treePath: TreePath) => void;
}

const OverviewContext = createContext<OverviewData>({
    selectedTreePath: new TreePath([]),
    setSelectedTreePath: () => { console.log('Bug: this function should never be called')},
});

function useOverviewContext(): OverviewData
{
    return useContext(OverviewContext);
}

function SectionViewer({ section }: { section: Section }): JSX.Element
{
    const [ children, setChildren ] = useState<Node[]>([]);
    const { selectedTreePath, setSelectedTreePath } = useOverviewContext();
    useEffect(() => section.addObserver(() => setChildren(section.children)), []);

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header' onClick={select}>
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
        const isSelected = section.treePath.isEqualTo(selectedTreePath);
        const isExpanded = section.treePath.isParentOf(selectedTreePath);

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

    function select()
    {
        setSelectedTreePath(section.treePath);
    }
}

function ExplanationViewer(props: { explanation: Explanation }) : JSX.Element
{
    return (
        <div className='overview-entry explanation'>
            {props.explanation.name}
        </div>
    );
}

function ExerciseViewer(props: { exercise: Exercise }): JSX.Element
{
    return (
        <div className='overview-entry exercise'>
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
    const [selectedTreePath, setSelectedTreePath] = useState<TreePath>(new TreePath([]));

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
        <OverviewContext.Provider value={{selectedTreePath, setSelectedTreePath}}>
            <div className="overview-root-container">
                {
                    topLevelNodes.map(node => <NodeViewer key={node.name} node={node} />)
                }
            </div>
        </OverviewContext.Provider>
    );
}

function buildUrl(treePath: TreePath): string
{
    const partsUrl = treePath.parts.join('/')

    return `/nodes/${partsUrl}`;
}


export default Overview;