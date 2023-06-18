import { Outlet } from 'react-router-dom';
import Overview from '@/components/Overview';
import { useEffect, useState } from 'react';
import { Node, createNodeFromTreePath } from './domain';


function App()
{
  const [rootSection, setRootSection] = useState<Node | undefined>(undefined);

  useEffect(
    () => {
      (async () => {
        const node = await createNodeFromTreePath([]);

        setRootSection(node);
      })();
    }, []
  );

  return (
    <>
      <div id="sidebar">
        <h1>Overview</h1>
        <nav>
          {rootSection ? <Overview root={rootSection} /> : <></>}
        </nav>
      </div>
      <div id="main-view">
        <Outlet />
      </div>
    </>
  );
}

export default App;
