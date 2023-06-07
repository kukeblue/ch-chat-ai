import { Children, useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
import './DefaultLayout.less'

const TabPic = {
    chatActive: "https://upload.cyuandao.com/2023060414530959065.png",
    chat: "https://upload.cyuandao.com/2023060414540270365.png",
    application: "https://upload.cyuandao.com/2023060415045618748.png",
    applicationActive: "https://upload.cyuandao.com/2023060415034687154.png",
    pic:"https://upload.cyuandao.com/2023060509091025094.png",
    picActive: "https://upload.cyuandao.com/2023060509103559980.png",
    creation: "https://upload.cyuandao.com/2023060509120974252.png",
    creationActive: "https://upload.cyuandao.com/2023060509121992859.png",
    my:"https://upload.cyuandao.com/2023060509123210046.png",
    myActive: "https://upload.cyuandao.com/2023060509124225729.png"
}

function BottomTab() {
    return <div className='bottom-tab'>
        <div className='bottom-tab-item'>
            <img src={TabPic.chatActive} className='bottom-tab-item-pic'/>
            <div className='bottom-tab-item-text_active'>聊天</div>
        </div>
        <div className='bottom-tab-item'>
            <img src={TabPic.pic} className='bottom-tab-item-pic'/>
            <div className='bottom-tab-item-text'>绘画</div>
        </div>
        <div className='bottom-tab-item'>
            <img src={TabPic.application} className='bottom-tab-item-pic'/>
            <div className='bottom-tab-item-text'>应用</div>
        </div>
        <div className='bottom-tab-item'>
            <img src={TabPic.creation} className='bottom-tab-item-pic'/>
            <div className='bottom-tab-item-text'>创作</div>
        </div>
        <div className='bottom-tab-item'>
            <img src={TabPic.my} className='bottom-tab-item-pic'/>
            <div className='bottom-tab-item-text'>我的</div>
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
                <img style={{marginRight: 5}} src="https://olddefaultx.h5.bigbigtool.com/static/images/update-vip-plus.svg"></img>
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
    return <div className='navigation_left'>
        <img src='https://upload.cyuandao.com/_nuxt/profile_1.svg' className='app-log'></img>
        <div className='app-name'>ChatBot</div>
        <div className='navigation-menu'>
            <div className='navigation-menu-item navigation-menu-item_active'>
                <img className='navigation-menu-item-img'src="https://olddefaultx.h5.bigbigtool.com/static/images/index-chat-active.svg"></img>
                <div className='navigation-menu-item-text'>聊天</div>
            </div>
            <div className='navigation-menu-item'>
                <img className='navigation-menu-item-img'src="https://olddefaultx.h5.bigbigtool.com/static/images/index-draw-active.svg"></img>
                <div className='navigation-menu-item-text'>绘画</div>
            </div>
            <div className='navigation-menu-item'>
                <img className='navigation-menu-item-img'src="https://olddefaultx.h5.bigbigtool.com/static/images/index-create-active.svg"></img>
                <div className='navigation-menu-item-text'>应用</div>
            </div>
            <div className='navigation-menu-item'>
                <img className='navigation-menu-item-img'src="https://olddefaultx.h5.bigbigtool.com/static/images/index-content-active.svg"></img>
                <div className='navigation-menu-item-text'>写作</div>
            </div>
            <div className='navigation-menu-item'>
                <img className='navigation-menu-item-img'src="https://olddefaultx.h5.bigbigtool.com/static/images/index-personal-active.svg"></img>
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

function DefaultLayout({children}) {
    useEffect(()=>{
    
    }, [])
    return <div className='app-layout'>
        <Navigation></Navigation>
        <div className='app-layout-right'>
            <Header></Header>
            {children}
        </div>
        <BottomTab></BottomTab>
    </div>
}

export default DefaultLayout;