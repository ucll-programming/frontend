import { Fragment, useEffect, useState } from "react";
import { useDomain, ContentNode } from "@/domain";
import { useActiveTreePath } from "@/main";
import ExerciseViewer from "./ExerciseViewer";
import ExplanationViewer from "./ExplanationViewer";
import SectionViewer from "./SectionViewer";


function NodeViewer()
{
    const path = useActiveTreePath();
    const domain = useDomain();
    const node = domain.lookup(path);

    if ( node === undefined )
    {
        console.error('Error: could not find node in domain:', path);
        return (
            <Fragment key="unknown">
                <p>Error: {path.toString()} not found in domain</p>
                <p>Domain root: {domain.root.treePath.toString()}</p>
            </Fragment>
        )
    }
    else if ( node.isSection() )
    {
        return (
            <Fragment key={node.treePath.toString()}>
                <SectionViewer section={node} />
            </Fragment>
        );
    }
    else if ( node.isExercise() )
    {
        return (
            <Fragment key={node.treePath.toString()}>
                <ExerciseViewer exercise={node} />
            </Fragment>
        );
    }
    else if ( node.isExplanation() )
    {
        return (
            <Fragment key={node.treePath.toString()}>
                <ExplanationViewer explanation={node} />
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
