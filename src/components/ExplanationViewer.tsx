import { Explanation } from "@/domain";
import { Markdown } from "@/components/Markdown";
import React from "react";
import LoadingAnimation from "./LoadingAnimation";


function ExplanationViewer({ explanation } : { explanation: Explanation })
{
    const [markdown, setMarkdown] = React.useState<string | null>(null);

    React.useEffect(() => {
        const func = async () => {
            setMarkdown(await explanation.markdown());
        };

        func();
    }, [ explanation ]);

    if ( markdown === null )
    {
        return (
            <LoadingAnimation />
        );
    }
    else
    {
        return (
            <div className="viewer explanation">
                <Markdown>
                    {markdown}
                </Markdown>
            </div>
        );
    }
}

export default ExplanationViewer;
