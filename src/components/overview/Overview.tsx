import { ContentNode } from '@/domain';
import { useEffect, useState } from 'react';
import NodeViewer from '@/components/overview/NodeViewer';


function Overview({ root }: { root: ContentNode }): JSX.Element
{
    const [topLevelNodes, setTopLevelNodes] = useState<ContentNode[]>([]);

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
