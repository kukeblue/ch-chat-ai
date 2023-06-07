import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import { createRoot } from "react-dom/client";
import ChatPage from "./page/chat/index"
import AuthWrapper from './component/AuthWrapper'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import DefaultLayout from './Layout/defaultLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate replace to="/chat" />
    ),
  },
  {
    path: "/chat/:uuid?",
    element: <AuthWrapper><ChatPage></ChatPage></AuthWrapper>,
  },
]);

// setupPageGuard(router)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <DefaultLayout>
      <div><RouterProvider router={router} /></div>
    </DefaultLayout>
  // </React.StrictMode>,
)
