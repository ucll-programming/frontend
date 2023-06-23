import SectionViewer from '@/components/overview/SectionViewer';
import ExerciseViewer from '@/components/overview/ExerciseViewer';
import ExplanationViewer from '@/components/overview/ExplanationViewer';
import ErrorViewer from '@/components/overview/ErrorViewer';
import { Node } from '@/domain';


function NodeViewer(props: { node: Node }): JSX.Element
{
    if ( props.node.isExercise() )
    {
        return <ExerciseViewer exercise={props.node} />;
    }
    else if ( props.node.isExplanation() )
    {
        return <ExplanationViewer explanation={props.node} />;
    }
    else if ( props.node.isSection() )
    {
        return <SectionViewer section={props.node} />;
    }
    else
    {
        return <ErrorViewer node={props.node} />;
    }
}


export default NodeViewer;
