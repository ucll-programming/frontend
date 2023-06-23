import { Explanation } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import LeafViewer from '@/components/overview/LeafViewer';


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

export default ExplanationViewer;
