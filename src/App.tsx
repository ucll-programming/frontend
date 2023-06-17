import { Outlet } from 'react-router-dom';
import './App.css';
import Overview from '@/components/Overview';
import { useEffect, useState } from 'react';
import { Section, fetchNodeData } from './rest';


function App()
{
  const [rootSection, setRootSection] = useState<Section | undefined>(undefined);

  useEffect(
    () => {
      (async () => {
        const response = await fetchNodeData([]);
        const data = await response.json();

        setRootSection(data);
      })();
    }, []
  );

  return (
    <>
      <div id="sidebar">
        <h1>Overview</h1>
        <nav>
          {rootSection ? <Overview rootSection={rootSection} /> : <></>}
        </nav>
      </div>
      <div id="main-view">
        <Outlet />
      </div>
    </>
  );
}

export default App;
