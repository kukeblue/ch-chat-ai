import request from './axios'
import useAuthStore from '@/store/authStore'
import { Modal } from 'antd'
import { getIsWechat } from '..'
function http(
    { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest },
) {
    const successHandler = (res) => {
        if (url.includes('permission') && res.data.code != 0) {
            const { end_at, numbers } = res.data.data
            if (numbers == 0) {
                Modal.warning({
                    title: '提示',
                    content: '会话次数已用完，开通会员后享受无限对话',
                    onOk: () => {
                        location.href = '/vip'
                    }
                });
                return
            }
            if (end_at != 0) {
                const timestamp = end_at * 1000
                const now = new Date().getTime()
                if (timestamp < now) {
                    Modal.warning({
                        title: '提示',
                        content: '会员已过期，请续费后继续使用',
                        onOk: () => {
                            location.href = '/vip'
                        }
                    });
                }
            }
            return
        }
        if (res.data.code == 0 || res.data.status === 'Success' || typeof res.data === 'string')
            return res.data
        if (res.data.code == 401) {
            const settingStore = useAuthStore.getState()
            settingStore.setToken("")
            // const useAuthStore = useAuthStore()
            // useAuthStore.setToken("")
            return
        }
        if (res.data.status === 'Unauthorized') {
            authStore.removeToken()
            window.location.reload()
        }
        return Promise.reject(res.data)
    }

    const failHandler = (error) => {
        afterRequest?.()
        throw new Error(error?.message || 'Error')
    }

    beforeRequest?.()

    method = method || 'GET'

    const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

    return method === 'GET'
        ? request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler)
        : request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export function get(
    { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest },
) {
    return http({
        url,
        method,
        data,
        onDownloadProgress,
        signal,
        beforeRequest,
        afterRequest,
    })
}

export function post(
    { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }
) {
    let token
    let device = getIsWechat() ? 'wechat' : 'pc'
    try {
        token = JSON.parse(localStorage['auth-storage']).state.token
    } catch {
        token = ''
    }
    headers = {
        ...headers,
        authorization: token,
        device: device,
    }


    return http({
        url,
        method,
        data,
        headers,
        onDownloadProgress,
        signal,
        beforeRequest,
        afterRequest,
    })
}

export default post
