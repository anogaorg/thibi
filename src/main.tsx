import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './App.tsx'
import ErrorPage from './ErrorPage.tsx'
import './index.css'
import Upload from './upload.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "upload",
        element: <Upload />,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  // Remember that StrictMode has this side effect: https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
