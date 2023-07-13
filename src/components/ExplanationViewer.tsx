import { Explanation } from "@/domain";
import { Markdown } from "@/components/Markdown";
import React from "react";


function ExplanationViewer({ explanation } : { explanation: Explanation })
{
    const [markdown, setMarkdown] = React.useState<string>('');

    React.useEffect(() => {
        const func = async () => {
            setMarkdown(await explanation.markdown());
        };

        func();
    }, [explanation]);

    return (
        <div className="viewer explanation">
            <Markdown>
                {markdown}
            </Markdown>
        </div>
    );
}


export default ExplanationViewer;
