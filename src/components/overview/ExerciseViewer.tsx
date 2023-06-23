import { Exercise } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import LeafViewer from './LeafViewer';


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

export default ExerciseViewer;