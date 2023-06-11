import { Children, useEffect, useState, useMemo } from 'react'
import { Input } from 'antd';
import "./index.less"
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'

import { useParams } from "react-router-dom";
import { fetchapiProcess } from '@/api'
import { PlusOutlined,PauseCircleOutlined, FormOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Drawer, Button } from 'antd';
import MarkdownPreview from '@uiw/react-markdown-preview';

let controller = new AbortController()

function ChatPage() {
    const [random, setRandom] = useState()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate();
    const { uuid } = useParams();
    const active = useChatStore((state) => state.active)
    const chat = useChatStore((state) => state.chat)
    const increasePopulation = useChatStore((state) => state.increasePopulation)
    const getChatByUuid = useChatStore((state) => state.getChatByUuid)
    const setActive = useChatStore((state) => state.setActive)
    const addChatByUuid = useChatStore((state) => state.addChatByUuid)
    const updateChatByUuid = useChatStore((state) => state.updateChatByUuid)
    const deleteChatByUuid = useChatStore((state) => state.deleteChatByUuid)
    const clearChatByUuid = useChatStore((state) => state.clearChatByUuid)
    const updateChatSomeByUuid = useChatStore((state) => state.updateChatSomeByUuid)
    const userInfo = useAuthStore((state) => state.userInfo)

    const addHistory = useChatStore((state) => state.addHistory)
    const usingContext = useChatStore((state) => state.usingContext)
    const history = useChatStore((state) => state.history)
    const currentHistory = history.find(item=>item.uuid == uuid)
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const deviceWidth = window.innerWidth;
    const dataSources = useMemo(() => getChatByUuid(uuid), [uuid, chat])
    console.log('debug dataSources history', dataSources, history)
    const buttonDisabled = useMemo(() => prompt != "" ? false : true, [prompt])
    const conversationList = dataSources.filter(item => (!item.inversion && !!item.conversationOptions))
    console.log('debug conversationList active', conversationList, active)

    useEffect(()=>{
        if(!uuid && active) {
            navigate("/chat/" + active);
            return
        }
        if(uuid != active) {
            setActive(uuid)
        }
    }, [uuid, active])

    const scrollToBottom = () => {
        let element = document.getElementById('talk-wrap');
        element.scrollTop = element.scrollHeight;
    }

    const handleSubmit = () => {
        increasePopulation()
        onConversation()
    }

    const onConversation = () => {
        scrollToBottom()
        setLoading(true)
        controller = new AbortController()
        console.log('debug onConversation')
        let message = prompt

        // todo 等待loading
        // if (loading.value)
        //     return
        if (!message || message.trim() === '')
            return
        let options = {}
        const lastContext = conversationList[conversationList.length - 1]?.conversationOptions
        if (lastContext && usingContext)
            options = { ...lastContext }
        addChatByUuid(
            +uuid,
            {
                dateTime: new Date().toLocaleString(),
                text: message,
                inversion: true,
                error: false,
                conversationOptions: null,
                requestOptions: { prompt: message, options: null },
            },
        )
        try {
            console.log('fetch chatgpt')
            let lastText = ''
            const fetchapiOnce = async () => {
                await fetchapiProcess({
                    prompt: message,
                    options,
                    signal: controller.signal,
                    onDownloadProgress: ({ event }) => {
                        console.log('== onDownloadProgress ==')
                        const xhr = event.target
                        const { responseText } = xhr
                        // Always process the final line
                        const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
                        let chunk = responseText
                        if (lastIndex !== -1)
                            chunk = responseText.substring(lastIndex)
                        try {
                            const data = JSON.parse(chunk)
                            updateChatByUuid(
                                +uuid,
                                dataSources.length - 1,
                                {
                                    dateTime: new Date().toLocaleString(),
                                    text: lastText + (data.text ?? ''),
                                    inversion: false,
                                    error: false,
                                    loading: true,
                                    conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                                    requestOptions: { prompt: message, options: { ...options } },
                                },
                            )
                            setRandom(Math.random())
                            // if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
                            // options.parentMessageId = data.id
                            // lastText = data.text
                            // message = ''
                            // return fetchapiOnce()
                            // }
                            // scrollToBottomIfAtBottom()
                        }
                        catch (error) {
                            //
                        }
                    }
                })
                setTimeout(()=>{
                    updateChatSomeByUuid(+uuid, -1, { loading: false })
                    setRandom(Math.random())
                    scrollToBottom()
                    setLoading(false)
                }, 500)
            }
            fetchapiOnce()
        } catch {
        }
        setPrompt('')
    }

    const handleAdd = () => {
        console.log('handleAdd')
        const uuid = Date.now()
        addHistory({ title: 'New Chat', uuid:uuid, isEdit: false })
        navigate("/chat/" + uuid);
        if(deviceWidth < 1000) {
            setDrawerOpen(false)
        }
    }

    const handleStop = () => {
        if (loading) {
          controller.abort()
          setLoading(false)
        }
    }

    const handleDelete = (uuid) => {
        if(history.length == 1) {
            handleAdd()
            deleteChatByUuid(uuid)
        }else {
            for(let i = 0; i < history.length; i++) {
                if(history[i].uuid != uuid ) {
                    handleSelectHistory(history[i].uuid)
                    break
                }
            }
            deleteChatByUuid(uuid)
        }
        
        if(deviceWidth < 1000) {
            setDrawerOpen(false)
        }
    }

    const handleSelectHistory = (uuid)=>{
        navigate("/chat/" + uuid);
        if(deviceWidth < 1000) {
            setDrawerOpen(false)
        }
    }

    return <div className='chat-page'>
        <Drawer
            style={{width: 220}}
            title=""
            placement="left"
            closable={true}
            onClose={()=>{
                setDrawerOpen(false)
            }}
            open={drawerOpen}
            key="left"
        >
            <div className='chat-check-list'>
                <div onClick={()=>handleAdd()} className='add-chat-button'>
                    <PlusOutlined />
                    &nbsp;
                    <div>创建新对话</div>
                </div>
                <div className='chat-old-list'>
                    {
                    history.map((item, index)=>{
                        return <div onClick={()=>handleSelectHistory(item.uuid)} key={item.uuid} className={item.uuid == active ? 'chat-old-list-item' : 'chat-old-list-item_unActive'}>
                            <div><FormOutlined /></div>
                            <div className='chat-old-list-item-title'>{item.title}</div>
                            <div onClick={(e)=>
                                {   handleDelete(item.uuid);
                                    e.stopPropagation();e.nativeEvent.stopImmediatePropagation(); 
                                }
                            } className='chat-old-list-item-delete'><DeleteOutlined /></div>
                        </div>
                    })
                    }
                </div>
            </div>
        </Drawer>
        <div className='chat-page-head'>
            <img onClick={()=>{ setDrawerOpen(true) }} className='three-dot' src="https://upload.cyuandao.com/2023060509403374746.png" />
            <div className='head-chat-title'>
                {currentHistory ? currentHistory.title : '新聊天对话'}
            </div>
            <div onClick={()=>handleAdd()} className='new-chat-icon'><img className='chat-page-head-plus' src="https://upload.cyuandao.com/2023060509462479577.png"></img>新会话</div>
        </div>
        <div className='chat-main'>
            <div className='chat-check-list'>
                <div onClick={()=>handleAdd()} className='add-chat-button'>
                    <PlusOutlined />
                    &nbsp;
                    <div>创建新对话</div>
                </div>
                <div className='chat-old-list'>
                    {
                    history.map((item, index)=>{
                        return <div onClick={()=>handleSelectHistory(item.uuid)} key={item.uuid} className={item.uuid == active ? 'chat-old-list-item' : 'chat-old-list-item_unActive'}>
                            <div><FormOutlined /></div>
                            <div className='chat-old-list-item-title'>{item.title}</div>
                            <div onClick={
                                (e)=>{handleDelete(item.uuid); e.stopPropagation();e.nativeEvent.stopImmediatePropagation(); 
                            }} className='chat-old-list-item-delete'><DeleteOutlined /></div>
                        </div>
                    })
                    }
                </div>
            </div>
            <div className='chat-talk-area'>
                <div className='talk-wrap' id="talk-wrap" >
                    {
                        dataSources.map((item, index) => {
                            return <div key={item.dateTime}>
                                {item.requestOptions &&
                                    <div className='talk-item'>
                                        <img src={userInfo.headimgurl || "https://upload.cyuandao.com/2023060722220917115.jpg"} className='talk-item-head' />
                                        <div className='chat-info'>
                                            <div className='talk-time'>{item.dateTime}</div>
                                            <div className='talk-content'>{item.requestOptions.prompt}</div>
                                        </div>
                                    </div>}
                                 <div className='talk-item robot-chat-item'>
                                    <img src="https://appstore.bigbigtool.com/images/common.png?v=2" className='talk-item-head' />
                                    <div className='chat-info'>
                                        {/* <div className='talk-time'>{item.dateTime}</div> */}
                                        <div className='talk-content'>
                                        {item.conversationOptions ? <MarkdownPreview
                                            source={item.text}
                                            rehypeRewrite={(node, index, parent) => {
                                                if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
                                                parent.children = parent.children.slice(1)
                                                }
                                            }}
                                        /> : <LoadingOutlined ></LoadingOutlined >}
                                        {
                                            item.loading && <span className="cursor" />
                                        }   
                                      </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                   
                    <div className='stop-button' > 
                    {loading && <Button icon={<PauseCircleOutlined />} type="primary" ghost onClick={()=>handleStop()}>
                        停止响应
                    </Button>}
                    </div>
                    <div style={{ height: 200 }}></div>
                </div>
                <div className='input-box'>
                    <div className='input-item'>
                        <Input
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value)
                            }}
                            placeholder="你想和我聊点什么" />
                    </div>
                    <div onClick={() => handleSubmit()} className={buttonDisabled ? 'send-img-item_dis' : 'send-img-item'}>发送</div>
                </div>
            </div>
        </div>
    </div>
}

export default ChatPage