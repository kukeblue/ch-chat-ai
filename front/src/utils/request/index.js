import request from './axios'
import useAuthStore from '@/store/authStore'


function http(
    { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest },
) {
    const successHandler = (res) => {
        // const authStore = useAuthStore()

        if (res.data.code == 0 || res.data.status === 'Success' || typeof res.data === 'string')
            return res.data

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
