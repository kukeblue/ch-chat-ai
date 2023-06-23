import React, { useState } from 'react'
import { LeftOutlined } from '@ant-design/icons';
import './index.less'
import { Input, Button } from 'antd';
const { TextArea } = Input;
import { useNavigate } from "react-router-dom";
import { fetchApiAppliction } from '@/api';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useParams } from "react-router-dom";
import {applictionDetailConfig} from './config'
import useAuthStore from '../../store/authStore'


let controller = new AbortController()

function ApplicationDetailPage() {
    const token = useAuthStore((state) => state.token)
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)
    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const [copyText, setCopyText] = useState("复制")
    const [loading ,setLoading] = useState(false)
    const { applictionKey } = useParams();
    const config = applictionDetailConfig[applictionKey]
    if(!config){
        location.href = "/"
        return
    }
    console.log(config)
    const applicationTips = config.tip
    const navigate = useNavigate();

    const handleStop = () => {
        if (loading) {
          controller.abort()
          setLoading(false)
        }
    }

    const onSubmit = () => {

        if(!prompt || loading) {
            return
        }
        setLoading(true)
        setCopyText("复制")
        setResult("")
        const fetchapiOnce = async () => {
            controller = new AbortController()
            await fetchApiAppliction({
                systemMessageKey: applictionKey,
                signal: controller.signal,
                prompt,
                onDownloadProgress: ({event})=> {
                    const xhr = event.target
                    const { responseText } = xhr
                    // Always process the final line
                    const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
                    let chunk = responseText
                    if (lastIndex !== -1)
                        chunk = responseText.substring(lastIndex)
                    try {
                        const data = JSON.parse(chunk)
                        setResult(data.text)
                    }
                    catch (error) {
                        //
                    }
                }
            })
            setTimeout(()=>{
                setLoading(false)
            }, 500)
        }
        fetchapiOnce()
        window._czc.push(["_trackEvent", '应用详情页面', '点击提交', '成功', 1]);
    }

    return <div className='application-detail-page'>
        <div className='application-detail-head'>
            <div 
            onClick={()=>{
                navigate(-1)
            }}
            className='appliction-back'>
                <LeftOutlined style={{ fontSize: '16px'}}/>
                <div>返回</div>
            </div>
            <div className='appliction-detail-title'>{config.title}</div>
        </div>
        <div className='appliction-detail-content'>
            <img src={config.pic} className='appliction-detail-pic'></img>
            <div className='appliction-detail-dec'>{config.dec}</div>
            <div className='appliction-detail-tips'>
                <div 
                onClick={()=>{
                    setPrompt(applicationTips[0])
                }}
                className='appliction-detail-tips-item'>示例1</div>
                <div 
                onClick={()=>{
                    setPrompt(applicationTips[1])
                }}
                className='appliction-detail-tips-item_2'>示例2</div>
                <div 
                onClick={()=>{
                    setPrompt(applicationTips[2])
                }}
                className='appliction-detail-tips-item_3'>示例3</div>
            </div>
            <div className='text-area-wrap'>
            <TextArea
                className='appliction-detail-textarea'
                showCount
                maxLength={200}
                style={{ width: '90%', minHeight: '100px'}}
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value)
                }}
                placeholder=""
                />
            </div>
            <Button 
            onClick={()=>{
                // if(!token) {
                //     setShowLoginModal(true)
                //     return
                // }
                onSubmit()
            }}
            loading={loading}
            className='produce-button'>生成</Button>
            {result != '' && <div  className='chat-result'>
                <MarkdownPreview
                    source={result}
                    rehypeRewrite={(node, index, parent) => {
                        if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
                        parent.children = parent.children.slice(1)
                        }
                    }}
                />
                {loading && <div className='produce-stop-button'>
                    <span 
                        onClick={()=>{
                            handleStop()
                        }}
                    >停止生成</span>
                </div>}
            </div>}
            {result != '' && !loading && <CopyToClipboard 
                text={result}
                onCopy={() => {
                    setCopyText('复制成功');
                }}
            >
                <Button className='copy-button'>{copyText}</Button>
            </CopyToClipboard>}
            <div style={{height: 50}}></div>
        </div>
    </div>
}

export default ApplicationDetailPage