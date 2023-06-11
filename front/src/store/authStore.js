import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(persist((set, get) => (
  {
    token: '',
    session: null,
    userInfo: {},
    setSession: (session) => set({ session: session }),
    setUserInfo: (userInfo) => set({ userInfo: userInfo }),
  }),{
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
  }))


export default useAuthStore