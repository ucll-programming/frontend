import { Explanation } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import { Link } from 'react-router-dom';
import { buildPageUrl } from '@/util';
import { useActiveTreePath } from '@/main';


function ExplanationViewer({ explanation }: { explanation: Explanation }): JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildPageUrl(explanation.treePath)}>
                    <span className='overview-entry-header-label'>
                        {explanation.name}
                    </span>
                </Link>
                <span className='overview-entry-header-symbol'>
                    <NodeSymbolViewer node={explanation} />
                </span>
            </h1>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = explanation.treePath.isEqualTo(activeTreePath);
        const result = [ 'overview-entry', 'explanation' ];

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
}

export default ExplanationViewer;
