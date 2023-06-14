import React from 'react'
import './index.less'
import useAuthStore from '../../store/authStore'
import { useNavigate } from "react-router-dom";

function MyPage() {
    const navigate = useNavigate();
    const userInfo = useAuthStore((state) => state.userInfo)
    return <div className='my-page'>
        <div className='my-content-wrap'>
            <div className='my-content'>
                <div className='my-page-header'>
                    <img src={userInfo.avatar || "https://upload.cyuandao.com/2023060722220917115.jpg"} className='my-avatar'></img>
                    <div className='my-info'> 
                        <div className='my-name-line'>
                            <div className='my-name'>{userInfo.nickname || "未登录"}</div>
                            <img src="https://upload.cyuandao.com/2023060917001222794.png" className='my-vip-icon'></img>
                        </div>
                        <div className='my-id'>
                            <div>ID：</div>
                            <div>11572521</div>
                        </div>
                    </div>
                </div>
                <div className='my-vip-message'>
                    <div className='my-vip-message-left'>
                        <img className='my-vip-message-left-pic' src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-text.5edd4dca.svg"></img>
                        <div className='my-vip-time'>会员到期：2023-07-02</div>
                    </div>
                    <div className='my-vip-message-right'>
                        <div onClick={() => navigate("/vip")} className='vip-due-right'>查看权益</div>
                    </div>
                </div>
                <div className='fun-item-list'>
                    <div className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918195820604.png" className='list-item-icon'></img>
                        <div className='list-item-text'>任务中心</div>
                    </div>
                    <div className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918222451632.png" className='list-item-icon'></img>
                        <div className='list-item-text'>联系客服</div>
                    </div>
                    <div className='list-item'>
                        <img src="https://upload.cyuandao.com/2023060918230880135.png" className='list-item-icon'></img>
                        <div className='list-item-text'>关于我们</div>
                    </div>
                    <div className='list-item logout'>
                        <div className='list-item-text'>退出登录</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default MyPage