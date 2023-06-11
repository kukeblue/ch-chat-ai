import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import { createRoot } from "react-dom/client";
import ChatPage from "./page/chat/index"
import AuthPage from "./page/auth/index"
import AuthWrapper from './component/AuthWrapper'
import MyPage from './page/my/index'
import ApplicationPage from './page/application/index'
import CreationPage from './page/creation/index'
import PicPage from './page/pic/index'
import VipPage from './page/vip/index'

import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Navigate
} from "react-router-dom";
import DefaultLayout from './Layout/DefaultLayout';


const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            {
                path: "/auth",
                element: (
                    <AuthPage></AuthPage>
                ),
            },
            {
                path: "/my",
                element: (
                    <MyPage />
                ),
            },
            {
                path: "/pic",
                element: (
                    <PicPage />
                ),
            },
            {
                path: "/application",
                element: (
                    <ApplicationPage />
                ),
            },
            {
                path: "/creation",
                element: (
                    <CreationPage />
                ),
            },
            {
                path: "/vip",
                element: (
                    <VipPage />
                ),
            },
            {
                path: "/chat/:uuid?",
                element: <AuthWrapper><ChatPage></ChatPage></AuthWrapper>,
            },
            {
                path: "/",
                element: (
                    <Navigate replace to="/chat" />
                ),
            },
        ],
    },
]);

// setupPageGuard(router)

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <div><RouterProvider router={router} /></div>
    // </React.StrictMode>,
)
