import React, { useEffect, useState } from 'react'
import { getUserPermission } from "@/api"
import './index.less'

function BingPage() {
    const [showPage, setShowPage] = useState(false)
    useEffect(()=>{
        getUserPermission('查询必应').then(res=>{
            setShowPage(true)
        })
    }, [])
    return <div className='bing-page'>
       <div className='bing-page-header'>
            必应AI
       </div>
       {showPage && <iframe id="my-iframe" className='bing-iframe' src='https://bing.vcanbb.top/web/index.html'></iframe>}
    </div>
}

export default BingPage