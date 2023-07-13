import { ContentNode } from '@/domain';
import NodeViewer from '@/components/overview/NodeViewer';


function Overview({ root }: { root: ContentNode }): JSX.Element
{
    const topLevelNodes = root.isSection() ? root.children : [root];

    return (
        <div className="overview-root-container">
            {
                topLevelNodes.map(node => <NodeViewer key={node.name} node={node} />)
            }
        </div>
    );
}

export default Overview;
