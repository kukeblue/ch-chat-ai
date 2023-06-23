import React from "react"
import './index.less'
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";


function AboutPage() {
    const navigate = useNavigate();
    return <div className="about-page">
        <div className='application-detail-head'>
            <div 
                onClick={()=>{
                    navigate(-1)
                }}
                className='appliction-back'>
                    <LeftOutlined style={{ fontSize: '16px'}}/>
                    <div>返回</div>
                </div>
            <div className='appliction-detail-title'>关于我们</div>
        </div>
        <img src="https://upload.cyuandao.com/_nuxt/main-icon.af9ad849.svg" className="about-icon"></img>
        <div className="about-text">BotAI</div>
        <div className="about-name">版本 1.0.1</div>
    </div>
}

export default AboutPage