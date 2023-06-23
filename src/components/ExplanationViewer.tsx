import { Explanation } from "@/domain";
import { Markdown } from "@/components/Markdown";


function ExplanationViewer({ explanation } : { explanation: Explanation })
{
    return (
        <div className="viewer explanation">
            <Markdown>
                {explanation.markdown}
            </Markdown>
        </div>
    );
}


export default ExplanationViewer;
