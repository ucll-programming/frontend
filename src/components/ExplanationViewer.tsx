import { Explanation } from "@/domain";
import { Markdown } from "@/components/Markdown";


function ExplanationViewer({ explanation } : { explanation: Explanation })
{
    return (
        <Markdown>
            {explanation.markdown}
        </Markdown>
    );
}


export default ExplanationViewer;
