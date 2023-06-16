import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import NodeViewer from './NodeViewer';



async function nodeLoader({ params } : any) : Promise<any>
{
  console.log(params);
  return { test: 5 };
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
