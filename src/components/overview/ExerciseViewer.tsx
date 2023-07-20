import { Exercise } from '@/domain';
import NodeSymbolViewer from '@/components/NodeSymbolViewer';
import React from 'react';
import { Judgment } from '@/rest';
import { useActiveTreePath } from '@/main';
import { Link } from 'react-router-dom';
import { buildPageUrl } from '@/util';
import RefreshIcon from '../RefreshIcon';


function SymbolContainer({ exercise }: { exercise: Exercise }): JSX.Element
{
    const [hovering, setHovering] = React.useState<boolean>(false);

    const innerElement = hovering ? (
        <div onMouseDown={() => exercise.judge()}>
            <RefreshIcon />
        </div>
    ) : (
        <NodeSymbolViewer node={exercise} />
    );

    return (
        <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
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
