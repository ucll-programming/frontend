import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoaderFunctionArgs, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import NodeViewer from '@/components/NodeViewer';
import { fetchNodeData } from './rest';


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


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
