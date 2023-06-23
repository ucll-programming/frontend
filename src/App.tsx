import { Outlet } from 'react-router-dom';
import Overview from '@/components/overview/Overview';
import { useEffect, useState } from 'react';
import { Domain, DomainContext, createDummyNode, createNodeFromTreePath } from './domain';
import Sidebar from './components/Sidebar';


function App()
{
  const [domain, setDomain] = useState<Domain>(new Domain(createDummyNode()));

  useEffect(
    () => {
      (async () => {
        const root = await createNodeFromTreePath([]);
        const domain = new Domain(root);

        setDomain(domain);
      })();
    },
    []
  );

  return (
    <>
      <DomainContext.Provider value={domain}>
        <Sidebar root={domain.root} />
        <div id="main-view-container">
          <div id="main-view">
            <Outlet />
          </div>
        </div>
      </DomainContext.Provider>
    </>
  );
}

export default App;
