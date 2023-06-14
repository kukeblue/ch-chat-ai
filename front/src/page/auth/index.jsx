import { useEffect } from "react"
import "./index.less"
import { useSearchParams } from "react-router-dom"
import { loginWx } from "@/api"
import useAuthStore from '@/store/authStore'



function AuthPage() {
    let [searchParams, setSearchParams] = useSearchParams()
    const code = searchParams.get("code")
    const setToken = useAuthStore((state) => state.setToken)
    useEffect(()=>{
        if(code) {
            console.log('获取用户信息')
            loginWx(code).then(res=>{
                console.log(res)
                setToken(res.data)
                location.href = "/"
            }).catch((error) => {
                alert('获取信息失败')
                // location.href = "/"
                console.error(error);
            });
        }
    }, [code])
    return <div>loadding</div>
}

export default AuthPage