import { Children, useEffect, useState, useMemo } from 'react'
import { Input } from 'antd';
import "./index.less"
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'
import { FloatButton } from 'antd';
import { FileTextOutlined, CustomerServiceOutlined, CommentOutlined, ClearOutlined } from '@ant-design/icons';

import { useParams } from "react-router-dom";
import { fetchapiProcess, getUserPermission } from '@/api'
import {
    PlayCircleOutlined,
    PlusOutlined,
    PauseCircleOutlined,
    FormOutlined,
    DeleteOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Drawer, Button } from 'antd';
import MarkdownPreview from '@uiw/react-markdown-preview';
import questions from "./question"

let controller = new AbortController()
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

function ChatPage() {
    console.log('change chatPage')
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
    const currentHistory = history.find(item => item.uuid == uuid)

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const deviceWidth = window.innerWidth;
    const dataSources = useMemo(() => getChatByUuid(uuid), [uuid, chat, random])
    const buttonDisabled = useMemo(() => prompt != "" ? false : true, [prompt])
    const conversationList = dataSources.filter(item => (!item.inversion && !!item.conversationOptions))
    let chatNotFinish = false
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)
    const token = useAuthStore((state) => state.token)


    if (!loading && dataSources.length > 0) {
        // item.conversationOptions ? <MarkdownPreview
        // source={item.text}
        // 检查最后一个字是否是句号
        const lastChat = dataSources[dataSources.length - 1]
        if (lastChat.conversationOptions && lastChat.text.length > 900) {
            let lastWord = lastChat.text.slice(-1); // -1 表示倒数第一位
            if (!["!", "?", ".", "！", "？", "。"].includes(lastWord)) {
                chatNotFinish = true
            }
        }
    }

    useEffect(() => {
        if (!currentHistory) {
            const changeUuid = history[0].uuid
            handleSelectHistory(changeUuid)
        }
    }, [])

    useEffect(() => {
        if (!uuid && active) {
            navigate("/chat/" + active, { replace: true });
            return
        }
        if (uuid != active) {
            setActive(uuid)
        }
    }, [uuid, active])

    const scrollToBottom = () => {
        let element = document.getElementById('talk-wrap');
        element.scrollTop = element.scrollHeight;
    }

    const handleSubmit = async () => {
        if (!token) {
            setShowLoginModal(true)
            return
        }
        increasePopulation()
        onConversation()
        window._czc.push(["_trackEvent", '聊天页面', '发送消息', '成功', 1]);
    }

    const handleContinue = () => {
        handleSubmit()
    }

    const onConversation = () => {
        scrollToBottom()
        setLoading(true)
        controller = new AbortController()
        let message = prompt || "继续"
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
            let lastText = ''
            const fetchapiOnce = async () => {
                await fetchapiProcess({
                    prompt: message,
                    options,
                    signal: controller.signal,
                    onDownloadProgress: ({ event }) => {
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
                        }
                        catch (error) {
                            console.log(error)
                        }
                    }
                })
                setTimeout(() => {
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
        const uuid = Date.now()
        addHistory({ title: 'New Chat', uuid: uuid, isEdit: false })
        navigate("/chat/" + uuid);
        if (deviceWidth < 1000) {
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
        if (history.length == 1) {
            handleAdd()
            deleteChatByUuid(uuid)
        } else {
            for (let i = 0; i < history.length; i++) {
                if (history[i].uuid != uuid) {
                    handleSelectHistory(history[i].uuid)
                    break
                }
            }
            deleteChatByUuid(uuid)
        }

        if (deviceWidth < 1000) {
            setDrawerOpen(false)
        }
    }

    const handleSelectHistory = (uuid) => {
        navigate("/chat/" + uuid);
        if (deviceWidth < 1000) {
            setDrawerOpen(false)
        }
    }

    return <div className='chat-page'>
        {screenWidth < 1000 && <FloatButton
            tooltip={<div 
                onClick={() => {
                    clearChatByUuid(uuid)
                    setTimeout(()=>{
                        setRandom(Math.random())
                    }, 1)
                }}
            >点击清空会话</div>}
            trigger="click"
            style={{ left: 14, bottom: 130 }}
            icon={<ClearOutlined />}
        />}
        {/* <FloatButton icon={ <ClearOutlined />}/>
            <FloatButton icon={<CommentOutlined />} /> */}

        <Drawer
            style={{ width: 220 }}
            title=""
            placement="left"
            closable={true}
            onClose={() => {
                setDrawerOpen(false)
            }}
            open={drawerOpen}
            key="left"
        >
            <div className='chat-check-list'>
                <div onClick={() => handleAdd()} className='add-chat-button'>
                    <PlusOutlined />
                    &nbsp;
                    <div>创建新对话</div>
                </div>
                <div className='chat-old-list'>
                    {
                        history.map((item, index) => {
                            return <div onClick={() => handleSelectHistory(item.uuid)} key={item.uuid} className={item.uuid == active ? 'chat-old-list-item' : 'chat-old-list-item_unActive'}>
                                <div><FormOutlined /></div>
                                <div className='chat-old-list-item-title'>{item.title}</div>
                                <div onClick={(e) => {
                                    handleDelete(item.uuid);
                                    e.stopPropagation(); e.nativeEvent.stopImmediatePropagation();
                                }
                                } className='chat-old-list-item-delete'><DeleteOutlined /></div>
                            </div>
                        })
                    }
                </div>
            </div>
        </Drawer>
        <div className='chat-page-head'>
            <img onClick={() => { setDrawerOpen(true) }} className='three-dot' src="https://upload.cyuandao.com/2023060509403374746.png" />
            <div className='head-chat-title'>
                {currentHistory ? currentHistory.title : '新聊天对话'}
            </div>
            <div onClick={() => handleAdd()} className='new-chat-icon'><img className='chat-page-head-plus' src="https://upload.cyuandao.com/2023060509462479577.png"></img>新会话</div>
        </div>
        <div className='chat-main'>
            <div className='chat-check-list'>
                <div onClick={() => handleAdd()} className='add-chat-button'>
                    <PlusOutlined />
                    &nbsp;
                    <div>创建新对话</div>
                </div>
                <div className='chat-old-list'>
                    {
                        history.map((item, index) => {
                            return <div onClick={() => handleSelectHistory(item.uuid)} key={item.uuid} className={item.uuid == active ? 'chat-old-list-item' : 'chat-old-list-item_unActive'}>
                                <div><FormOutlined /></div>
                                <div className='chat-old-list-item-title'>{item.title}</div>
                                <div onClick={
                                    (e) => {
                                        handleDelete(item.uuid); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation();
                                    }} className='chat-old-list-item-delete'><DeleteOutlined /></div>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className='chat-talk-area'>
                <div className='talk-wrap' id="talk-wrap" >
                    {!dataSources || dataSources.length == 0 &&
                        <div className='chat-tip'>
                            <div className='chat-tip-name'>BOTAI机器人</div>
                            <div className='chat_tip_icons'>
                                <div className='chat_tip_icon'>
                                    <img src='https://upload.cyuandao.com/_nuxt/ERSX3.svg' className='chat-tip-pic' />
                                    <div className='chat-tip-text'>
                                        解决工作问题
                                    </div>
                                </div>
                                <div className='chat_tip_icon'>
                                    <img src='https://upload.cyuandao.com/_nuxt/interest-question (1).svg' className='chat-tip-pic' />
                                    <div className='chat-tip-text'>
                                        有趣的提问
                                    </div>
                                </div>
                                <div className='chat_tip_icon'>
                                    <img src='https://upload.cyuandao.com/_nuxt/love-chat.svg' className='chat-tip-pic' />
                                    <div className='chat-tip-text'>
                                        恋爱聊天技巧
                                    </div>
                                </div>
                            </div>
                            <div className='flex-container'>
                                {
                                    questions.map((item, key) => {
                                        return <div
                                            onClick={() => {
                                                setPrompt(item)
                                            }}
                                            key={"_" + key} className='flexbox-item'>
                                            <span>
                                                {item}
                                            </span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>}
                    {
                        dataSources.map((item, index) => {
                            return <div key={item.dateTime}>
                                {item.requestOptions &&
                                    <div className='talk-item'>
                                        <img src={userInfo.avatar || "https://upload.cyuandao.com/2023060722220917115.jpg"} className='talk-item-head' />
                                        <div className='chat-info'>
                                            <div className='talk-time'>{item.dateTime}</div>
                                            <div style={{ marginLeft: 20 }} className='talk-content'>{item.requestOptions.prompt}</div>
                                        </div>
                                    </div>}
                                <div className='talk-item robot-chat-item'>
                                    <img src="https://upload.cyuandao.com/2023061517552139548.png" className='talk-item-head' />
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
                        {loading && <Button icon={<PauseCircleOutlined />} type="primary" ghost onClick={() => handleStop()}>
                            停止生成
                        </Button>}
                        {chatNotFinish && <Button icon={<PlayCircleOutlined />} type="primary" ghost onClick={() => handleContinue()}>
                            继续生成
                        </Button>}
                    </div>
                    <div style={{ height: 200 }}></div>
                </div>
                <div className='input-box'>
                    <div className='input-item'>
                        <Input
                            onPressEnter={() => !loading && !buttonDisabled && handleSubmit()}
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value)
                            }}
                            placeholder="你想和我聊点什么" />
                    </div>
                    <div onClick={() => !loading && !buttonDisabled && handleSubmit()} className={buttonDisabled ? 'send-img-item_dis' : 'send-img-item'}>发送</div>
                </div>
            </div>
        </div>
    </div>
}

export default ChatPage