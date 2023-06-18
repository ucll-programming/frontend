import { useLoaderData, useParams } from "react-router-dom";
import { MaterialNode, isExercise, isExplanation, isSection } from "../rest";
import { Fragment } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import admonitions from 'remark-admonitions';
import { useDomain } from "@/domain";
import { useActiveTreePath } from "@/main";


function NodeViewer()
{
    const path = useActiveTreePath();
    const domain = useDomain();
    const node = domain.lookup(path);

    if ( node === undefined )
    {
        return (
            <Fragment key="unknown">
                <p>Error: {path.toString()} not found in domain</p>
                <p>Domain root: {domain.root.path}</p>
            </Fragment>
        )
    }
    else if ( node.isSection() )
    {
        return (
            <Fragment key={node.path}>
                <p>Section {node.path}</p>
            </Fragment>
        );
    }
    else if ( node.isExercise() )
    {
        return (
            <Fragment key={node.path}>
                <ReactMarkdown remarkPlugins={[]}>
                    {node.markdown}
                </ReactMarkdown>
            </Fragment>
        );
    }
    else if ( node.isExplanation() )
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