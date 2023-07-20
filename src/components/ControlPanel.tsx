import { useActiveTreePath } from "@/main";
import RefreshIcon from "./RefreshIcon";


export default function ControlPanel(): JSX.Element
{
    const activeTreePath = useActiveTreePath();

    return (
        <div id="control-panel">
            <p>
                {activeTreePath.toString()}
            </p>
            <RefreshIcon />
        </div>
    );
}
