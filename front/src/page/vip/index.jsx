import React from 'react'
import './index.less'
import useAuthStore from '../../store/authStore'

function vipPage() {
    const userInfo = useAuthStore((state) => state.userInfo)
    return <div className='vip-page-wrap'>
    <div className='vip-page'>
       <div className='vip-user-card'>
            <img 
            src={userInfo.headimgurl || "https://upload.cyuandao.com/2023060722220917115.jpg"}
            className='vip-user-card-avatar'/>
            <div className='vip-user-card-info'>
                <div className='vip-user-card-info-name'>{userInfo.nickname || "未登录"}</div>
                <div className='vip-user-card-info-time'>会员到期：2023-07-02</div>
            </div>
       </div>
       <div className='select-vip-block'>
            <div className='vip-select-title'>
                选择套餐 
                <img src="https://upload.cyuandao.com/2023061012324874865.png" className='vip-logo'></img></div>
            <div className='vip-buy-item-list'>
                <div className='vip-buy-item'>
                    <div className='vip-name'>一个月VIP</div>
                    <div className='vip-price'>
                        <span  style={{"fontSize": 16}}>￥</span>
                    49</div>
                    <div className='vip-original-price'>
                        <span>￥</span>
                    49</div>
                    <div className='vip-user-select'>5%用户的选择</div>
                </div>
                <div className='vip-buy-item'>
                    <div className='vip-name'>三个月VIP</div>
                    <div className='vip-price'>
                        <span  style={{"fontSize": 16}}>￥</span>
                    89</div>
                    <div className='vip-original-price'>
                        <span>￥</span>
                    198</div>
                    <div className='vip-user-select'>10%用户的选择</div>
                </div>
                <div className='vip-buy-item'>
                <div className='vip-name'>一年VIP</div>
                    <div className='vip-price'>
                        <span  style={{"fontSize": 16}}>￥</span>
                    169</div>
                    <div className='vip-original-price'>
                        <span>￥</span>
                    398</div>
                    <div className='vip-user-select'>20%用户的选择</div>
                </div>
            </div>
            <div className='vip-buy-item-lifelong'>
                <img src="https://upload.cyuandao.com/2023061015133423365.png" className='recommend-pic'></img>
                <div>
                    <div className='recommend-item-title'>终身VIP</div>
                    <div className='recommend-item-dec'>限时优惠，立省
                        <div className='recommend-item-original-price'>￥700</div>
                    </div>
                </div>
                <div className='vip-recommend-price'>
                    <div className='vip-recommend-price-value'><span>￥</span>299</div>
                    <div className='vip-recommend-price-original-value'>￥999</div>
                </div>
            </div>
            <div className='recharge-button'>立即续费</div>
       </div>
       <div className='membership-benefits'>
            <div className='membership-benefits-title'>会员权益</div>
            <div className='benefits-list'>
                <div className='benefits-item'>
                    <img src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-4.e103c326.svg" className='benefits-item-pic'>
                    </img>
                    <div className='benefits-item-text'>
                        无限AI会话
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-5.bdcc63d4.svg"
                    className='benefits-item-pic'>
                        
                    </img>
                    <div className='benefits-item-text'>
                        无限AI绘图
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-1.110bfa3a.svg"
                    className='benefits-item-pic'>
                        
                    </img>
                    <div className='benefits-item-text'>
                        高速接口
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-2.048af9d9.svg"
                    className='benefits-item-pic'>
                    </img>
                    <div className='benefits-item-text'>
                        会员尊享
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-3.9aedec32.svg"    
                    className='benefits-item-pic'>
                    </img>
                    <div className='benefits-item-text'>
                        功能解锁
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-6.5c2dcd4c.svg"
                    className='benefits-item-pic'>
                    </img>
                    <div className='benefits-item-text'>
                        云端同步
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-7.8794f4e8.svg"
                    className='benefits-item-pic'>
                    </img>
                    <div className='benefits-item-text'>
                        文章创作
                    </div>
                </div>
                <div className='benefits-item'>
                    <img 
                    src="https://olddefaultx.h5.bigbigtool.com/static/img/vip-rights-8.790ed862.svg"
                    className='benefits-item-pic'>
                        
                    </img>
                    <div className='benefits-item-text'>
                        50+应用
                    </div>
                </div>
            </div>
       </div>
       <div className='vip-equity-tips'>会员服务为虚拟商品，支付成功后不支持退款</div>
    </div>
    </div>
}

export default vipPage