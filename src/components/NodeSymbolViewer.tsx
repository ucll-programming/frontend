import { ContentNode } from '@/domain';
import DifficultyViewer from './DifficultyViewer';
import * as icons from '@primer/octicons-react';


function NodeSymbolViewer({ node } : { node: ContentNode }): JSX.Element
{
    if ( node.isExercise() )
    {
        return (
            <DifficultyViewer difficulty={node.difficulty} />
        );
    }
    else if ( node.isSection() )
    {
        return (
            <icons.ListUnorderedIcon />
        );
    }
    else if ( node.isExplanation() )
    {
        return (
            <icons.BookIcon />
        );
    }
    else
    {
        return (
            <icons.XCircleFillIcon />
        );
    }
}

export default NodeSymbolViewer;