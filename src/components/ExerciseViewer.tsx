import { Exercise } from "@/domain";
import { Markdown } from "@/components/Markdown";


function ExerciseViewer({ exercise } : { exercise: Exercise })
{
    return (
        <div className="viewer exercise">
            <Markdown>
                {exercise.markdown}
            </Markdown>
        </div>
    );
}


export default ExerciseViewer;
