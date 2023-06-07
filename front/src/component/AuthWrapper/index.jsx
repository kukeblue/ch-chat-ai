import { Children, useEffect, useState } from 'react'
import useAuthStore  from '@/store/authStore'
import {fetchSession} from '@/api/index'
import './index.less'



function AuthWrapper({children}) {
    const authStore = useAuthStore((state) => state)
    const setSession = useAuthStore((state) => state.setSession)
    const [isAuthSuccess, setIsAuthSuccess] = useState(false)

    useEffect(()=>{
        console.log('执行初始化...')
        async function getSession() {
            if (!authStore.session) {
                console.log('session不存在')
                try { 
                    const data = await fetchSession()
                    setSession(data)
                }catch(err) {
    
                }
            }
            setIsAuthSuccess(true)
        }
        getSession();
    }, [])

    return <>
        {isAuthSuccess ? children : <div>加载中...</div>}
    </>
}

export default AuthWrapper;