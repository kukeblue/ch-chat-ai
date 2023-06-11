import { useEffect } from "react"
import "./index.less"
import { useSearchParams } from "react-router-dom"
import { loginWx } from "@/api"
import useAuthStore from '@/store/authStore'


function AuthPage() {
    let [searchParams, setSearchParams] = useSearchParams()
    const setUserInfo = useAuthStore((state) => state.setUserInfo)

    const code = searchParams.get("code")
    useEffect(()=>{
        if(code) {
            console.log('获取用户信息')
            loginWx(code).then(res=>{
                setUserInfo(res.data)
                alert(JSON.stringify(res.data))
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