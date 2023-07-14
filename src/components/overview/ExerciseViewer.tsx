import { Exercise } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import LeafViewer from './LeafViewer';
import React from 'react';
import { Judgement } from '@/rest';


function ExerciseViewer({ exercise } : { exercise: Exercise }): JSX.Element
{
    const [ judgement, setJudgement ] = React.useState<Judgement>('unknown');

    React.useEffect(() => {
        const func = async () => {
            const judgement = await exercise.judgement();
            setJudgement(judgement);

            if ( judgement === 'unknown' )
            {
                setTimeout(func, 1000);
            }
        };

        func();
    }, [exercise]);

    const classNames = [ 'exercise', judgement ];

    return (
        <LeafViewer
            caption={exercise.name}
            symbol={<NodeSymbolViewer node={exercise} />}
            classNames={classNames}
            treePath={exercise.treePath} />
    );
}

export default ExerciseViewer;