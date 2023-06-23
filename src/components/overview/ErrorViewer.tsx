import { Node } from '@/domain';



function ErrorViewer(props: { node: Node }): JSX.Element
{
    return (
        <div>
            ERROR: Don't know what to do with {props.node.path}
        </div>
    );
}


export default ErrorViewer;
