import React, { useEffect, useState } from 'react'
import './index.less'
import useAuthStore from '../../store/authStore'
import { getVipList, getPayData } from '@/api'


function vipPage() {

    const [vipList, setVipList] = useState()

    useEffect(() => {
        getVipList().then(res => {
            setVipList(res.data)
        })
    }, [])

    const handlePay = () => {
        getPayData('64885f39d32e501445005ae3').then(res=>{
            const data = res.data
            wx.chooseWXPay({
                timestamp: data.TimeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.NonceStr, // 支付签名随机串，不长于 32 位
                package: data.Package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.SignType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
                paySign: data.PaySign, // 支付签名
                success: function (res) {
                    alert(JSON.stringify(res))
                  // 支付成功后的回调函数
                }
              });


        })
    }

    const userInfo = useAuthStore((state) => state.userInfo)
    return <div className='vip-page-wrap'>
        <div className='vip-page'>
            <div className='vip-user-card'>
                <img
                    src={userInfo.headimgurl || "https://upload.cyuandao.com/2023060722220917115.jpg"}
                    className='vip-user-card-avatar' />
                <div className='vip-user-card-info'>
                    <div className='vip-user-card-info-name'>{userInfo.nickname || "未登录"}</div>
                    <div className='vip-user-card-info-time'>会员到期：2023-07-02</div>
                </div>
            </div>
            {vipList && <div className='select-vip-block'>
                <div className='vip-select-title'>
                    选择套餐
                    <img src="https://upload.cyuandao.com/2023061012324874865.png" className='vip-logo'></img></div>
                <div className='vip-buy-item-list'>
                    <div className='vip-buy-item'>
                        <div className='vip-name'>{vipList[0].name}</div>
                        <div className='vip-price'>
                            <span style={{ "fontSize": 16 }}>￥</span>
                            {vipList[0].discount}</div>
                        <div className='vip-original-price'>
                            <span>￥</span>
                            {vipList[0].account}</div>
                        <div className='vip-user-select'>5%用户的选择</div>
                    </div>
                    <div className='vip-buy-item'>
                        <div className='vip-name'>{vipList[1].name}</div>
                        <div className='vip-price'>
                            <span style={{ "fontSize": 16 }}>￥</span>
                            {vipList[1].discount}</div>
                        <div className='vip-original-price'>
                            <span>￥</span>
                            {vipList[1].account}</div>
                        <div className='vip-user-select'>10%用户的选择</div>
                    </div>
                    <div className='vip-buy-item'>
                        <div className='vip-name'>{vipList[2].name}</div>
                        <div className='vip-price'>
                            <span style={{ "fontSize": 16 }}>￥</span>
                            {vipList[2].discount}</div>
                        <div className='vip-original-price'>
                            <span>￥</span>
                            {vipList[2].account}</div>
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
                <div onClick={()=>{
                    handlePay()
                }} className='recharge-button'>
                    
                    立即续费
                </div>
            </div>}
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