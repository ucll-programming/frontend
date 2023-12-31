import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Domain, DomainContext, loadDomain } from './domain';
import Sidebar from './components/Sidebar';
import LoadingAnimation from './components/LoadingAnimation';


function App()
{
    const [ domain, setDomain ] = useState<Domain | null>( null );

    useEffect(
        () =>
        {
            ( async () =>
            {
                const domain = await loadDomain();
                domain.root.judge();

                setDomain( domain );
            } )();
        },
        []
    );

    if ( domain )
    {
        return (
            <DomainContext.Provider value={domain}>
                <Sidebar root={domain.root} />
                <div id="main-view-container">
                    <div id="main-view">
                        <Outlet />
                    </div>
                </div>
            </DomainContext.Provider>
        );
    }
    else
    {
        return (
            <LoadingAnimation />
        );
    }
}

export default App;
