import { Exercise } from "@/domain";
import { Markdown } from "@/components/Markdown";


function ExerciseViewer({ exercise } : { exercise: Exercise })
{
    return (
        <Markdown>
            {exercise.markdown}
        </Markdown>
    );
}


export default ExerciseViewer;
