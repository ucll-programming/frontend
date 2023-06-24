import { TreePath } from '@/domain';
import { useActiveTreePath } from '@/main';
import { Link } from 'react-router-dom';
import { buildPageUrl } from '@/util';


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
                <Link to={buildPageUrl(treePath)}>
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


export default LeafViewer;
