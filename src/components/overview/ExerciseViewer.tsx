import { Exercise } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import React, { useCallback } from 'react';
import { Judgment } from '@/rest';
import { useActiveTreePath } from '@/main';
import { Link } from 'react-router-dom';
import { buildPageUrl } from '@/util';
import RefreshIcon from '../RefreshIcon';


function SymbolContainer({ exercise }: { exercise: Exercise }): JSX.Element
{
    const [hovering, setHovering] = React.useState<boolean>(false);
    const onMouseEnter = useCallback(() => setHovering(true), []);
    const onMouseLeave = useCallback(() => setHovering(false), []);
    const onMouseDown = useCallback(() => exercise.rejudge(), [exercise]);

    const innerElement = hovering ? (
        <div >
            <RefreshIcon />
        </div>
    ) : (
        <NodeSymbolViewer node={exercise} />
    );

    return (
        <div className='symbol-container' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseDown={onMouseDown}>
            {innerElement}
        </div>
    );
}


function ExerciseViewer({ exercise }: { exercise: Exercise }): JSX.Element
{
    const activeTreePath = useActiveTreePath();
    const [ judgment, setJudgment ] = React.useState<Judgment>('unknown');

    React.useEffect(() => {
        setJudgment(exercise.judgment.value);
        return exercise.judgment.observe(() => setJudgment(exercise.judgment.value));
    }, [exercise]);

    const classNames = [ 'exercise', judgment ];

    return (
        <div className={determineClassName()}>
            <h1 className='overview-entry-header'>
                <Link to={buildPageUrl(exercise.treePath)}>
                    <span className='overview-entry-header-label'>
                        {exercise.name}
                    </span>
                </Link>
                <span className='overview-entry-header-symbol'>
                    <SymbolContainer exercise={exercise} />
                </span>
            </h1>
        </div>
    );


    function determineClassName(): string
    {
        const isSelected = exercise.treePath.isEqualTo(activeTreePath);
        const result = [ 'overview-entry', ...classNames ];

        if ( isSelected )
        {
            result.push('selected');
        }

        return result.join(' ');
    }
}

export default ExerciseViewer;
