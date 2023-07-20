import { useActiveTreePath } from "@/main";
import { SyncIcon } from "@primer/octicons-react";


export default function ControlPanel(): JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div id="control-panel">
            <p>
                {activeTreePath.toString()}
            </p>
            <SyncIcon />

        </div>
    );
}
