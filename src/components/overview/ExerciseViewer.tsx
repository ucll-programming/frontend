import { Exercise } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import LeafViewer from './LeafViewer';
import React from 'react';
import { Judgment } from '@/rest';


function ExerciseViewer({ exercise } : { exercise: Exercise }): JSX.Element
{
    const [ judgment, setJudgment ] = React.useState<Judgment>('unknown');

    React.useEffect(() => {
        setJudgment(exercise.judgment.value);
        return exercise.judgment.observe(() => setJudgment(exercise.judgment.value));
    }, [exercise]);

    const classNames = [ 'exercise', judgment ];

    return (
        <LeafViewer
            caption={exercise.name}
            symbol={<NodeSymbolViewer node={exercise} />}
            classNames={classNames}
            treePath={exercise.treePath} />
    );
}

export default ExerciseViewer;
