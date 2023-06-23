import React, { useEffect, useMemo, useState } from 'react'
import './index.less'
import useAuthStore from '../../store/authStore'
import { useNavigate } from "react-router-dom";
import { Modal } from 'antd';
import { getIsWechat } from '@/utils'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
function MyPage() {
    const token = useAuthStore((state) => state.token)
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)
    const isWechat = getIsWechat()
    const navigate = useNavigate();
    const userInfo = useAuthStore((state) => state.userInfo)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const getIsVip = useAuthStore((state) => state.getIsVip)
    const isVip = useMemo(() => getIsVip(), [userInfo])

    useEffect(()=>{
        if(!token) {
            setShowLoginModal(true)
        }
    }, [])

    return <div className='my-page'>
        <Modal 
        style={{ top: '25%' }}
        width={230}
        title={false} 
        footer={false}
        open={isModalOpen} 
        onOk={()=>{
        }} onCancel={()=>{
            setIsModalOpen(false)
        }}>
            <div className='kefu-modal'>
                <p>联系专属客服</p>
                <img src="https://upload.cyuandao.com/_nuxt/88888866666.png" className='kefu-pic'></img>
                <p>请使用微信扫描二维码</p>
            </div>
        </Modal>
        <div className='my-content-wrap'>
            <div className='my-content'>
                <div className='my-page-header'>
                    <img src={userInfo.avatar || "https://upload.cyuandao.com/2023060722220917115.jpg"} className='my-avatar'></img>
                    <div className='my-info'> 
                        <div className='my-name-line'>
                            <div className='my-name'>{userInfo.nickname || "未登录"}</div>
                            {isVip && <img src="https://upload.cyuandao.com/2023060917001222794.png" className='my-vip-icon'></img>}
                        </div>
                        <div className='my-id'>
                            <div>ID：</div>
                            <div>{userInfo.id ? userInfo.id.slice(0, 5) : ''}</div>
                        </div>
                    </div>
                </div>
                <div className='my-vip-message'>
                    <div className='my-vip-message-left'>
                        <img className='my-vip-message-left-pic' src="https://upload.cyuandao.com/_nuxt/421232fsd.svg"></img>
                        <div className='my-vip-time'>会员到期：{isVip ? isVip : '开通会员'}</div>
                    </div>
                    <div className='my-vip-message-right'>
                        <div onClick={() => navigate("/vip")} className='vip-due-right'>查看权益</div>
                    </div>
                </div>
                <div className='fun-item-list'>
                    <div onClick={()=>{
                        // Toastify({
                        //     text: "暂无任务",
                        //     className: "info",
                        //     position: 'center',
                        //     duration: 1500,
                        //     offset: {
                        //         // x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                        //         y: 50 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                        //     },
                        //     style: {
                        //       background: "linear-gradient(to right, #00b09b, #96c93d)",
                        //     }
                        //   }).showToast();
                        // setIsModalOpen(true)
                        // Modal.warning({
                        //     title: '提示',
                        //     content: '暂无任务',
                        //   });
                    }} className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918195820604.png" className='list-item-icon'></img>
                        <div className='list-item-text'>任务中心</div>
                    </div>
                    <div onClick={()=>{
                        setIsModalOpen(true)
                    }} className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918222451632.png" className='list-item-icon'></img>
                        <div className='list-item-text'>联系客服</div>
                    </div>
                    <div 
                    onClick={() => navigate("/about")}
                    className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918230880135.png" className='list-item-icon'></img>
                        <div className='list-item-text'>关于我们</div>
                    </div>
                    {!isWechat ? <div 
                    onClick={()=>{
                        localStorage.clear()
                        location.href = '/my?temp=rxp'
                    }}
                    className='list-item logout'>
                        <div className='list-item-text'>退出登录</div>
                    </div>: <div 
                    onClick={()=>{
                        localStorage.clear()
                        location.href = '/'
                    }}
                    className='list-item logout'>
                        <div className='list-item-text'>重新登录</div>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export default MyPage