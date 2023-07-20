import { Section, TreePath } from '@/domain';
import { useActiveTreePath } from '@/main';
import { Link } from 'react-router-dom';
import { buildPageUrl } from '@/util';
import NodeViewer from '@/components/overview/NodeViewer';


function SectionViewer({ section }: { section: Section }): JSX.Element
{
    const activeTreePath = useActiveTreePath();
    const children = section.children;

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildPageUrl(determineLinkedTreePath())}>
                    {section.name}
                </Link>
            </h1>
            <div className='section-children'>
                {children.map(child => <NodeViewer key={child.name} node={child} />)}
            </div>
        </div>
    );


    function determineLinkedTreePath(): TreePath
    {
        const selfTreePath = section.treePath;
        const parent = section.parent;

        if ( isSelected() )
        {
            if ( parent )
            {
                return parent.treePath;
            }
            else
            {
                return selfTreePath;
            }
        }
        else
        {
            return selfTreePath;
        }
    }

    function determineClassName(): string
    {
        const result = ['overview-entry', 'section'];

        if ( isExpanded() )
        {
            result.push('expanded');
        }
        else
        {
            result.push('collapsed');
        }

        if ( isSelected() )
        {
            result.push('selected');
        }

        return result.join(' ');
    }

    function isExpanded(): boolean
    {
        return section.treePath.isParentOf(activeTreePath);
    }

    function isSelected(): boolean
    {
        return section.treePath.isEqualTo(activeTreePath);
    }
}


export default SectionViewer;
