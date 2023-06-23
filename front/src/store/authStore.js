import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getDate } from '../utils'

const useAuthStore = create(persist((set, get) => (
  {
    showLoginModal: false,
    token: '',
    session: null,
    userInfo: {},
    user: {},
    setToken: (token) => set({ token: token }),
    setShowLoginModal: (showLoginModal) => set({ showLoginModal }),
    setSession: (session) => set({ session: session }),
    setUserInfo: (userInfo) => set({ userInfo: userInfo }),
    setUser: (user) => set({ user: user }),

    getIsVip: () => {
      const membership = get().user.membership
      if(!membership || !(membership.end_at)) {
        return false
      }else {
        const timestamp = membership.end_at * 1000 
        const now = new Date().getTime()
        if(timestamp > now) {
          console.log(timestamp)
          return getDate(timestamp)
        }else {
          return false
        }
      }
  },
  }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
  }
  ))


export default useAuthStore