import { useLoaderData } from "react-router-dom";


function NodeViewer()
{
    const { test } = useLoaderData() as { test: number } ;

    return (
        <p>
            Node! {test}
        </p>
    );
}


export default NodeViewer;