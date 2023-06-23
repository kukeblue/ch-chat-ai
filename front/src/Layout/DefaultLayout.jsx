import { Children, useEffect, useState, useMemo } from 'react'
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
import './DefaultLayout.less'
import { getIsWechat } from '../utils/index'
import useAuthStore from '@/store/authStore'
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { getUser, getWeChatSign } from '../api/index';
import { register } from '../utils/index'
import { Modal } from 'antd';
import { getWeChatScanCode, getQrcodeResult } from '@/api'

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

const pageData = ["chat", "bing", "application", "creation", "my"]

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
            onClick={() => navigate("/bing")}
            className='bottom-tab-item'>
            <img src={index == 1 ? TabPic.chatActive : TabPic.chat} className='bottom-tab-item-pic' />
            <div className={index == 1 ? 'bottom-tab-item-text_active' : 'bottom-tab-item-text'}>必应</div>
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

let interval = null

function Header() {
    const [qrCodeData, setQrCodeData] = useState({})
    const [expired, setExpired] = useState(false)
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken)
    const showLoginModal = useAuthStore((state) => state.showLoginModal)
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)

    
    useEffect(()=>{
        if(showLoginModal) {
            if(interval) {
                clearInterval(interval)
            }
            setExpired(false)
            getWeiXinScranCode()
            
        }else {
            clearInterval(interval)
        }

    }, [showLoginModal])

    const getWeiXinScranCode = ()=>{
        getWeChatScanCode().then(res=> {
            res.data.url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.ticket
            setQrCodeData(res.data)
            let outTime = 0
            interval = setInterval(()=>{
                if(outTime == 60) {
                    clearInterval(interval)
                    setExpired(true)
                    return
                }
                outTime = outTime + 1
                getQrcodeResult(res.data.nid).then(res=>{
                    console.log(res)
                    if(res.data) {
                        window._czc.push(["_trackEvent", 'APP', 'PC端点击登录', '成功', 1]);
                        clearInterval(interval)
                        setToken(res.data)
                        setShowLoginModal(false)
                        location.href = '/'
                    }
                })
            }, 1000)
        })
    }
    
    const userInfo = useAuthStore((state) => state.userInfo)
    const getIsVip = useAuthStore((state) => state.getIsVip)
    const isVip = useMemo(() => getIsVip(), [userInfo])
    const token = useAuthStore((state) => state.token)
    return <div className='layout-header'>
        <Modal style={{top: 180}} className="login-modal" width="785px" title="Basic Modal" open={showLoginModal} footer={false} onCancel={()=>{
            setShowLoginModal(false)
        }}>
            <div className='scan-login-modal'>
                <div className='login-vip-fun'>
                    <img className='login-vip-fun-img' src="https://upload.cyuandao.com/_nuxt/login-left-info.svg"></img>
                </div>
                <div className='login-scan-content'>
                    <div className='login-scan-content-title'><img
                    src='https://upload.cyuandao.com/_nuxt/weixin.svg'
                    ></img>登录即可免费领取试用会员</div>
                    <div className='scan-warp'>
                        {qrCodeData.url && <img src={qrCodeData.url} className='scan-img'/>}
                        {expired && <div className='overtime-item'>
                            <span>二维码已失效，</span>
                            <span onClick={()=>{
                                setExpired(false)
                                getWeiXinScranCode()
                            }} className='scan-img-refresh'>重新获取</span>
                        </div>}
                    </div>
                </div>
            </div>
        </Modal>
        <div className='header-notice'>
            <Alert
                icon={<img src="
                https://upload.cyuandao.com/_nuxt/horn.svg
                "></img>}
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
            <div
            onClick={()=>{
                navigate('/vip')
            }}
            className='header-vip'>
                <img style={{ marginRight: 5 }} src="
                https://upload.cyuandao.com/_nuxt/update-vip-plus22.svg
            "></img>
                <span>{isVip ? '会员到期：' + isVip : '开通会员'}</span>
            </div>
            <div className='header-user-info'>
                <img src={userInfo.avatar || "https://upload.cyuandao.com/_nuxt/20230618122917.jpg"} className='header-user-avatar'></img>
                <div className='header-user-name' onClick={()=>{
                    !token && setShowLoginModal(true)
                    window._czc.push(["_trackEvent", 'APP', 'PC端点击登录', '扫码', 1]);
                }}>{userInfo.nickname || '点击登录'}</div>
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
        <img src='https://upload.cyuandao.com/_nuxt/20230618122917.jpg' className='app-log'></img>
        <div className='app-name'>BotAI</div>
        <div className='navigation-menu'>
            <div 
            onClick={() => navigate("/")}
            className={'navigation-menu-item ' + (navigationIndex == 0 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://upload.cyuandao.com/_nuxt/index-chat-active.svg"></img>
                <div className='navigation-menu-item-text'>聊天</div>
            </div>
            <div 
             onClick={() => navigate("/bing")}
            className={'navigation-menu-item ' + (navigationIndex == 1 ? 'navigation-menu-item_active' : '')}
            >
                <img className='navigation-menu-item-img' src="https://upload.cyuandao.com/_nuxt/index-chat-active.svg"></img>
                <div className='navigation-menu-item-text'>必应</div>
            </div>
            <div
            onClick={() => navigate("/application")}
            className={'navigation-menu-item ' + (navigationIndex == 2 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="https://upload.cyuandao.com/_nuxt/index-create-active4.svg"
            ></img>
                <div className='navigation-menu-item-text'>应用</div>
            </div>
            <div 
            onClick={() => navigate("/creation")}
            className={'navigation-menu-item ' + (navigationIndex == 3 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="
                https://upload.cyuandao.com/_nuxt/index-content-active5.svg
                "></img>
                <div className='navigation-menu-item-text'>写作</div>
            </div>
            <div
            onClick={() => navigate("/my")}
            className={'navigation-menu-item ' + (navigationIndex == 4 ? 'navigation-menu-item_active' : '')}>
                <img className='navigation-menu-item-img' src="
                https://upload.cyuandao.com/_nuxt/index-personal-active6.svg
                "></img>
                <div className='navigation-menu-item-text'>个人</div>
            </div>
        </div>
        <div className='menu-line'></div>
        <div 
        onClick={()=>{
            navigate('/vip')
        }}
        className='vip-update-menu'>
            <img className='vip-update-menu-icon' src='
            https://upload.cyuandao.com/_nuxt/black-update-vip-plus7.svg
            '></img>
            升级Plus
        </div>
    </div>
}

let notLayoutPages = ['appliction-detail', 'about', 'clear']
let isInit = false
function DefaultLayout(props) {
    const routerLocation = useLocation();
    const isAuthPage = location.href.includes('auth')
    const isWechat = getIsWechat()
    const setUser = useAuthStore((state) => state.setUser)
    const setUserInfo = useAuthStore((state) => state.setUserInfo)
    const isNotLayout = !!notLayoutPages.find(item=>location.href.includes(item))
    useEffect(() => {
        console.log('Location changed!', location.pathname);
    }, [routerLocation]);
    if(!isWechat) {
        const token = useAuthStore((state) => state.token)
        if(token) {
            getUser().then(res=>{
                setUser(res.data)
                setUserInfo(res.data)
                _czc.push(["_setCustomVar", res.data.membership.vip, 'PC', 1]);
            })
        }
    }
    if (isWechat && !isAuthPage) {
        const token = useAuthStore((state) => state.token)
        if (!token) {
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9376ece495c2a90a&redirect_uri=https://wap.kukechen.top/auth&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect"
        }else {
            if(!isInit) {
            // 存在openid 获取用户
            getUser().then(res=>{
                setUser(res.data)
                setUserInfo(res.data)
                _czc.push(["_setCustomVar", res.data.membership.vip, 'WX', 1]);
            })
            // 注册微信jsdk
            getWeChatSign().then(res=> {
                console.log('debug', res.data)
                const config = res.data
                register(wx, config, {
                    title: 'BOT AI 聊天助手',
                    desc: 'chatGPT 智能聊天机器人免费试用',
                    link: location.href,
                    imgUrl: 'https://upload.cyuandao.com/_nuxt/20230618122917.jpg',
                })
            })
            isInit = true}
        }
    }
    return isAuthPage ? <div className='app-layout'> <Outlet /> </div> : <div className='app-layout'>
        {!isNotLayout && <Navigation></Navigation>}
        <div className='app-layout-right'>
            {!isNotLayout && <Header></Header>}
            <Outlet />
        </div>
        <BottomTab></BottomTab>
    </div>
}

export default DefaultLayout;