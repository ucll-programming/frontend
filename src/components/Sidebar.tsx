import { Node } from '@/domain';
import Overview from '@/components/overview/Overview';
import NavigationControls from '@/components/NavigationControls';


function Sidebar({ root }: { root: Node }): JSX.Element
{
    return (
        <div id="sidebar">
            <NavigationControls />
            <Overview root={root} />
        </div>
    );
}

export default Sidebar;
