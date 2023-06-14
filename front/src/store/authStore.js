import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(persist((set, get) => (
  {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODczMzk5NDQsImlhdCI6MTY4NjczNTE0NCwiaWQiOiI2NDgxOTM4OGU3ODZjNDdmYjQzZTI5MDciLCJpc3MiOiJjaGF0QUkifQ.daZx9PYnqUAEBjQr5dMTQZBeTvLVXmaJh4mqGoXg_94',
    session: null,
    userInfo: {},
    user: {},
    setToken: (token) => set({ token: token }),
    setSession: (session) => set({ session: session }),
    setUserInfo: (userInfo) => set({ userInfo: userInfo }),
    setUser: (user) => set({ user: user }),
  }),{
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
  }))


export default useAuthStore