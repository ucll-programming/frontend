import { Exercise } from "@/domain";
import { Markdown } from "@/components/Markdown";
import React from "react";
import LoadingAnimation from "./LoadingAnimation";


function ExerciseViewer({ exercise } : { exercise: Exercise })
{
    const [markdown, setMarkdown] = React.useState<string | null>(null);

    React.useEffect(() => {
        const func = async () => {
            setMarkdown(await exercise.markdown());
        };

        func();
    }, [ exercise ]);

    if ( markdown === null )
    {
        return (
            <LoadingAnimation />
        );
    }
    else
    {
        return (
            <div className="viewer exercise">
                <Markdown>
                    {markdown}
                </Markdown>
            </div>
        );
    }
}


export default ExerciseViewer;
