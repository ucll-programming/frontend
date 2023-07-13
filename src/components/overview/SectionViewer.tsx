import { ContentNode, Section } from '@/domain';
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
                <Link to={buildPageUrl(section.treePath)}>
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


export default SectionViewer;
