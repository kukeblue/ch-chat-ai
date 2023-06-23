import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useChatStore = create(persist((set, get) => (
  {
    active: 1,
    usingContext: true,
    history: [{ uuid: 1, title: 'New Chat', isEdit: false }],
    chat: [{ uuid: 1, data: [] }],
    bears: 0,

    
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),

    setActive: (uuid) => set((state) => {
      state.active = uuid
      return {
        ...state,
        active: uuid
      }
    }),

    getChatByUuid: (uuid) => {
        let ret = null
        if (uuid) {
            ret = get().chat.find(item => item.uuid == uuid)?.data ?? [] 
        }
        else {
            ret = get().chat.find(item => item.uuid == get().active)?.data ?? []
        
        }
        return ret
    },

    /** 
    * [Object Chat]
      dateTime: string
      text: string
      inversion?: boolean
      error?: boolean
      loading?: boolean
      conversationOptions?: ConversationRequest | null
      requestOptions: { prompt: string; options?: ConversationRequest | null }
    **/

    

    addChatByUuid: (uuid, chat) => set((state) => {
      if (!uuid || uuid === 0) {
        if (state.history.length === 0) {
          const uuid = Date.now()
          state.history.push({ uuid, title: chat.text, isEdit: false })
          state.chat.push({ uuid, data: [chat] })
          state.active = uuid
        }
      }
      const index = state.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        state.chat[index].data.push(chat)
        if (state.history[index].title === 'New Chat')
        state.history[index].title = chat.text
      }
      return Object.assign({}, state)
    }),

    addHistory: (history) => set((state) => {
      state.history.unshift(history)
      state.chat.unshift({ uuid: history.uuid, data: [] })
      state.active = history.uuid
      return Object.assign({}, state)
    }),

    updateChatByUuid: (uuid, index, chat) => set((state) => {
      if (!uuid || uuid == 0) {
        if (state.chat.length) {
          state.chat[0].data[index] = chat
        }
        return
      }

      const chatIndex = state.chat.findIndex(item => item.uuid == uuid)
      if (chatIndex != -1) {
        state.chat[chatIndex].data[index] = chat
      }
      return Object.assign({}, state)
    }),

    clearChatByUuid: (uuid) => set((state) => {
      if (!uuid || uuid === 0) {
        if (state.chat.length) {
          state.chat[0].data = []
        }
        return Object.assign({}, state)
      }
      const index = state.chat.findIndex(item => item.uuid == uuid)
      if (index !== -1) {
        state.chat[index].data = []
      }
      return Object.assign({}, state)
    }),

    updateChatSomeByUuid: (uuid, index, chat)=>set((state) => {
      const chatIndex = state.chat.findIndex(item => item.uuid == uuid)
      let len = state.chat[chatIndex].data.length
      if (chatIndex !== -1) {
        state.chat[chatIndex].data[len - 1] = { ...state.chat[chatIndex].data[len - 1], ...chat }
      }
      return Object.assign({}, state)
    }),

    deleteChatByUuid: (uuid) => set((state) => {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          state.chat[0].data.splice(index, 1)
        }
        return
      }

      const chatIndex = state.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        state.chat.splice(chatIndex, 1)
        state.history.splice(chatIndex, 1)
      }
      return Object.assign({}, state)
    }),
  }),{
    name: 'chat-storage',
    storage: createJSONStorage(() => localStorage),
  }))


export default useChatStore