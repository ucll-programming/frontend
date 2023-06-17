import { useLoaderData } from "react-router-dom";
import { MaterialNode, isExercise, isExplanation, isSection } from "./rest";


function NodeViewer()
{
    const node = useLoaderData() as MaterialNode;

    if ( isSection(node) )
    {
        return (
            <>
                <p>Section</p>
            </>
        );
    }
    else if ( isExercise(node) )
    {
        return (
            <>
                <p>Exercise</p>
            </>
        );
    }
    else if ( isExplanation(node) )
    {
        return (
            <>
                <p>Explanation</p>
            </>
        );
    }
    else
    {
        return (
            <>
                <p>
                    Unrecognized node type
                </p>
            </>
        );
    }
}


export default NodeViewer;