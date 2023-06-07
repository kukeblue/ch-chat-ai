import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(persist((set, get) => (
  {
    token: '',
    session: null,
    setSession: (session) => set({ session: session }),


  }),{
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
  }))


export default useAuthStore