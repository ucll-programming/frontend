import { Outlet } from 'react-router-dom';
import Overview from '@/components/Overview';
import { useEffect, useState } from 'react';
import { Domain, DomainContext, createDummyNode, createNodeFromTreePath } from './domain';


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
        <div id="sidebar">
          <nav>
            <Overview root={domain.root} />
          </nav>
        </div>
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
