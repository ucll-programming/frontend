import NodeViewer from '@/components/NodeViewer';
import Welcome from '@/components/Welcome';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, useParams } from 'react-router-dom';
import App from './App';
import { TreePath } from './domain';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '',
        element: <Welcome />
      },
      {
        path: "nodes/*",
        element: <NodeViewer />,
      },
    ],
  }
]);

export function useActiveTreePath(): TreePath
{
  const params = useParams();
  const path = params['*'];

  if ( path !== undefined )
  {
    if ( path == '' )
    {
      return new TreePath([]);
    }
    else
    {
      const parts = path.split('/');

      return new TreePath(parts);
    }
  }
  else
  {
    return new TreePath([]);
  }
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
