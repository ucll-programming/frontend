import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoaderFunctionArgs, RouterProvider, createBrowserRouter, useParams } from 'react-router-dom';
import App from './App';
import NodeViewer from '@/components/NodeViewer';
import { fetchNodeData } from './rest';
import { TreePath } from './domain';


async function nodeLoader({ params } : LoaderFunctionArgs) : Promise<Response>
{
  //const tree_path = params['*'];
  const tree_path_string = params['*'];

  if ( tree_path_string === undefined )
  {
    throw new Error("Bug detected: nodeLoader should receive path from router");
  }

  const tree_path = tree_path_string.split('/');

  return await fetchNodeData(tree_path);
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "nodes/*",
        element: <NodeViewer />,
        loader: nodeLoader,
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
    const parts = path.split('/');

    return new TreePath(parts);
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
