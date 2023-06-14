import { post } from '@/utils/request'
import useAuthStore from '@/store/authStore'
import useSettingStore from '@/store/settingStore'



export function fetchapiProcess(params) {
    const settingStore = useSettingStore.getState()
    const authStore = useAuthStore.getState()

    let data = {
        prompt: params.prompt,
        options: params.options,
    }

    if (authStore.isChatGPTAPI) {
        data = {
            ...data,
            systemMessage: settingStore.systemMessage,
            temperature: settingStore.temperature,
            top_p: settingStore.top_p,
        }
    }

    return post({
        url: '/api/chat-process',
        data,
        signal: params.signal,
        onDownloadProgress: params.onDownloadProgress,
    })
}

export function fetchSession() {
    return post({
        url: '/api/session',
    })
}

export function loginWx(code) {
    return post({
        url: '/api/manage/wechat/authorization',
        data: {
            "code": code
        }
    })
}

export function getUser(openid) {
    return post({
        url: '/api/manage/ucenter/get_user_info',
        data: {
            "openid": openid
        }
    })
}

export function getVipList() {
    return post({
        url: '/api/manage/ucenter/get_vip_list',
        data: {
        }
    })
}

export function getPayData(id) {
    return post({
        url: '/api/manage/wechat/jsapi',
        data: {
            "id": id
        }
    })
}

export function fetchApiAppliction(params) {
    let data = {
        prompt: params.prompt,
        systemMessageKey: params.systemMessageKey
    }
    return post({
        url: '/api/chat-appliction',
        data,
        signal: params.signal,
        onDownloadProgress: params.onDownloadProgress,
    })
}

export function getWeChatSign() {
    return post({
        url: '/api/manage/wechat/share',
        data: {
            "url": location.href
        }
    })
}

