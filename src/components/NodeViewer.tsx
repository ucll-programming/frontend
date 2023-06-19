import { Fragment } from "react";
import { useDomain } from "@/domain";
import { useActiveTreePath } from "@/main";
import ExerciseViewer from "./ExerciseViewer";


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
                <ExerciseViewer exercise={node} />
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
