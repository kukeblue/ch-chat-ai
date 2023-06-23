import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import { createRoot } from "react-dom/client";
import ChatPage from "./page/chat/index"
import AuthPage from "./page/auth/index"
import AuthWrapper from './component/AuthWrapper'
import MyPage from './page/my/index'
import ClearPage from './page/clear/index'

import ApplicationPage from './page/application/index'
import CreationPage from './page/creation/index'
import ApplictionDetailPage from './page/applictionDetail/index'
import PicPage from './page/pic/index'
import VipPage from './page/vip/index'
import BingPage from './page/bing/index'
import AboutPage from './page/about/index'


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
                path: "/bing",
                element: (
                    <BingPage />
                ),
            },
            {
                path: "/pic",
                element: (
                    <PicPage />
                ),
            },{
                path: "/clear",
                element: (
                    <ClearPage />
                ),
            },
            {
                path: "/application",
                element: (
                    <ApplicationPage />
                ),
            },
            {
                path: "/appliction-detail/:applictionKey",
                element: (
                    <ApplictionDetailPage />
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
            }, {
                path: "/about",
                element: (
                    <AboutPage />
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


ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <div><RouterProvider router={router} /></div>
    // </React.StrictMode>,
)
