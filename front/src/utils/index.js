export function getIsWechat() {
    const ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
}

let hasRegister = false

export function register(wx, config, {
    title,
    desc,
    link,
    imgUrl,
}) {
    if(config && hasRegister == false) {
        hasRegister = true
        const body = {
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: config.appid, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名
            jsApiList: [
                "chooseWXPay",
                "getLocation",
                "updateTimelineShareData",
                "updateAppMessageShareData",
                "hideMenuItems"
                // 'chooseWXPay'
            ] // 必填，需要使用的JS接口列表
        }
        wx.config(body);
        wx.ready(function(){
            if(link && link.includes('2142')) {
                console.warn('隐藏转发按钮')
                wx.hideMenuItems({
                    menuList: ["menuItem:favorite","menuItem:originPage","menuItem:openWithSafari","menuItem:openWithQQBrowser","menuItem:copyUrl","menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq",
                    "menuItem:share:weiboApp", "menuItem:share:QZone", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
                });
                return
            }
            wx.updateAppMessageShareData({ 
                title,
                desc,
                link,
                imgUrl,
                success: function () {
                    // 设置成功
                }
            })
            wx.updateTimelineShareData({ 
                title: link && link.includes('2010') ? desc : title,
                link,
                imgUrl,
                success: function () {
                // 设置成功
                }
            })
        });
        wx.error(function(){
        })
    }
}