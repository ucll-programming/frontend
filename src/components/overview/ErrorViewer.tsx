import { ContentNode } from '@/domain';



function ErrorViewer(props: { node: ContentNode }): JSX.Element
{
    return (
        <div>
            ERROR: Don't know what to do with {props.node.treePath.toString()}
        </div>
    );
}


export default ErrorViewer;
