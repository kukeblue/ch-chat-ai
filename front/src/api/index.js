import { post } from '@/utils/request'
import useAuthStore from '@/store/authStore'
import useSettingStore from '@/store/settingStore'


export function fetchChatAPIProcess(params) {
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
