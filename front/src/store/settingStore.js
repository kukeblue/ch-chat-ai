import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useSettingStore = create(persist((set, get) => (
  {
    systemMessage: '你是一个智能助手, 基于Openai的API制作的定制机器人, 可以帮助用户回答任何问题，除了政治问题。',
    temperature: 0.8,
    top_p: 1,
  }),{
    name: 'settings-storage',
    storage: createJSONStorage(() => localStorage),
  }))


export default useSettingStore