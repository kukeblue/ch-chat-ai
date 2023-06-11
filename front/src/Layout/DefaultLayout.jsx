import { Children, useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
import './DefaultLayout.less'
import { getIsWechat } from '../utils/index'
import useAuthStore from '@/store/authStore'
import { useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';

const TabPic = {
    chatActive: "https://upload.cyuandao.com/2023060414530959065.png",
    chat: "https://upload.cyuandao.com/2023060414540270365.png",
    application: "https://upload.cyuandao.com/2023060415045618748.png",
    applicationActive: "https://upload.cyuandao.com/2023060415034687154.png",
    pic: "https://upload.cyuandao.com/2023060509091025094.png",
    picActive: "https://upload.cyuandao.com/2023060509103559980.png",
    creation: "https://upload.cyuandao.com/2023060509120974252.png",
    creationActive: "https://upload.cyuandao.com/2023060509121992859.png",
    my: "https://upload.cyuandao.com/2023060509123210046.png",
    myActive: "https://upload.cyuandao.com/2023060509124225729.png"
}

const pageData = ["chat", "pic", "application", "creation", "my"]

function BottomTab() {
    const href = location.href
    const index = pageData.findIndex(item => {
        return href.includes(item)
    })
    console.log('index', index)
    const navigate = useNavigate();
    return index > -1 && <div className='bottom-tab'>
        <div
            onClick={() => navigate("/")}
            className='bottom-tab-item'>
            <img src={index == 0 ? TabPic.chatActive : TabPic.chat} className='bottom-tab-item-pic' />
            <div className={index == 0 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'} >聊天</div>
        </div>
        <div 
            onClick={() => navigate("/pic")}
            className='bottom-tab-item'>
            <img src={index == 1 ? TabPic.picActive : TabPic.pic} className='bottom-tab-item-pic' />
            <div className={index == 1 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'}>绘画</div>
        </div>
        <div 
            onClick={() => navigate("/application")}
            className='bottom-tab-item'>
            <img src={index == 2 ? TabPic.applicationActive : TabPic.application} className='bottom-tab-item-pic' />
            <div className={index == 2 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'}>应用</div>
        </div>
        <div 
            onClick={() => navigate("/creation")}
            className='bottom-tab-item'>
            <img src={index == 3 ? TabPic.creationActive : TabPic.creation} className='bottom-tab-item-pic' />
            <div className={index == 3 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'}>创作</div>
        </div>
        <div
            onClick={() => navigate("/my")}
            className='bottom-tab-item'>
            <img src={index == 4 ? TabPic.myActive : TabPic.my} className='bottom-tab-item-pic' />
            <div className={index == 4 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'}>我的</div>
        </div>
    </div>
}

function Header() {
    return <div className='layout-header'>
        <div className='header-notice'>
            <Alert
                icon={<img src="https://olddefaultx.h5.bigbigtool.com/static/images/horn.svg"></img>}
                showIcon={true}
                banner
                message={
                    <Marquee
                        pauseOnHover gradient={false}>
                        稳定、高效、快速！预购从速，即将涨价! Ctrl+D 快捷收藏本站地址，防丢失不迷路！
                    </Marquee>
                }
            />
        </div>
        <div className='header-vip-area'>
            <div className='header-vip'>
                <img style={{ marginRight: 5 }} src="https://olddefaultx.h5.bigbigtool.com/static/images/update-vip-plus.svg"></img>
                <span>会员到期：2023-07-02</span>
            </div>
            <div className='header-user-info'>
                <img src="https://upload.cyuandao.com/_nuxt/profile_1.svg" className='header-user-avatar'></img>
                <div>kuke</div>
            </div>
        </div>
    </div>

}

function Navigation() {
    const href = location.href
    const navigationIndex = pageData.findIndex(item => {
        return href.includes(item)
    })
    const navigate = useNavigate();
    return <div className='navigation_left'>
        <img src='https://upload.cyuandao.com/_nuxt/profile_1.svg' className='app-log'></img>
        <div className='app-name'>ChatBot</div>
        <div className='navigation-menu'>
            <div 
            onClick={() => navigate("/")}
            className={'navigation-menu-item ' + (navigationIndex == 0 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://olddefaultx.h5.bigbigtool.com/static/images/index-chat-active.svg"></img>
                <div className='navigation-menu-item-text'>聊天</div>
            </div>
            <div 
            className={'navigation-menu-item ' + (navigationIndex == 1 ? 'navigation-menu-item_active' : '')}
            >
                <img className='navigation-menu-item-img' src="https://olddefaultx.h5.bigbigtool.com/static/images/index-draw-active.svg"></img>
                <div className='navigation-menu-item-text'>绘画</div>
            </div>
            <div 
            className={'navigation-menu-item ' + (navigationIndex == 2 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://olddefaultx.h5.bigbigtool.com/static/images/index-create-active.svg"></img>
                <div className='navigation-menu-item-text'>应用</div>
            </div>
            <div 
            className={'navigation-menu-item ' + (navigationIndex == 3 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://olddefaultx.h5.bigbigtool.com/static/images/index-content-active.svg"></img>
                <div className='navigation-menu-item-text'>写作</div>
            </div>
            <div
            onClick={() => navigate("/my")}
            className={'navigation-menu-item ' + (navigationIndex == 4 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://olddefaultx.h5.bigbigtool.com/static/images/index-personal-active.svg"></img>
                <div className='navigation-menu-item-text'>个人</div>
            </div>
        </div>
        <div className='menu-line'></div>
        <div className='vip-update-menu'>
            <img className='vip-update-menu-icon' src='https://olddefaultx.h5.bigbigtool.com/static/images/black-update-vip-plus.svg'></img>
            升级Plus
        </div>

    </div>
}

function DefaultLayout(props) {
    const isAuthPage = location.href.includes('auth')
    const isWechat = getIsWechat()

    if (isWechat && !isAuthPage) {
        const userInfo = useAuthStore((state) => state.userInfo)
        if (!userInfo.openid) {
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9376ece495c2a90a&redirect_uri=https://wap.kukechen.top/auth&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect"
            return
        }
    }
    return isAuthPage ? <div className='app-layout'> <Outlet /> </div> : <div className='app-layout'>
        <Navigation></Navigation>
        <div className='app-layout-right'>
            <Header></Header>
            <Outlet />
        </div>
        <BottomTab></BottomTab>
    </div>
}

export default DefaultLayout;