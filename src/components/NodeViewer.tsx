import { useLoaderData, useParams } from "react-router-dom";
import { MaterialNode, isExercise, isExplanation, isSection } from "../rest";
import { Fragment } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";


function NodeViewer()
{
    const node = useLoaderData() as MaterialNode;
    const path = useParams()['*'];

    if ( isSection(node) )
    {
        return (
            <Fragment key={node.path}>
                <p>Section {node.path}</p>
            </Fragment>
        );
    }
    else if ( isExercise(node) )
    {
        return (
            <Fragment key={node.path}>
                <p>
                    Exercise {node.path}
                </p>
                <ReactMarkdown>
                    {node.markdown}
                </ReactMarkdown>
            </Fragment>
        );
    }
    else if ( isExplanation(node) )
    {
        return (
            <Fragment key={node.path}>
                <p>Explanation {node.path}</p>
            </Fragment>
        );
    }
    else
    {
        return (
            <Fragment key="unknown">
                <p>
                    Unrecognized node type
                </p>
            </Fragment>
        );
    }
}


export default NodeViewer;