import { Exercise } from "@/domain";
import { Markdown } from "@/components/Markdown";
import React from "react";


function ExerciseViewer({ exercise } : { exercise: Exercise })
{
    // TODO Have load screen
    const [markdown, setMarkdown] = React.useState<string>('');

    React.useEffect(() => {
        const func = async () => {
            setMarkdown(await exercise.markdown());
        };

        func();
    }, [exercise]);

    return (
        <div className="viewer exercise">
            <Markdown>
                {markdown}
            </Markdown>
        </div>
    );
}


export default ExerciseViewer;
