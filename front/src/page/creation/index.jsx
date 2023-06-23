import React, { useState } from 'react'
import './index.less'
import { Button, Input, Radio, Tabs } from 'antd';
import { fetchApiAppliction } from '@/api';
import { Divider } from 'antd';
import useAuthStore from '../../store/authStore'
let controller = new AbortController()

function CreationPage() {
    const token = useAuthStore((state) => state.token)
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)
    const [type, setType] = useState('写作') // 写作 改写 补全
    const [voice, setVoice] = useState('严肃') // 写作 改写 补全
    const [updateActicle, setUpdateActicle] = useState('')
    const [acticle, setActicle] = useState('')
    const [require, setRequire] = useState('')

    const [writingTheme, setWritingTheme] = useState()
    const [outline, setOutline] = useState()
    const [loading, setLoading] = useState(false)
    const [bodyText, setBodyText] = useState([])
    const [parentMessageId, setParentMessageId] = useState()

    const handleClear = () => {
        setWritingTheme('')
        setOutline('')
        setLoading(false)
        setBodyText([])
        setParentMessageId('')
    }

    const defaultValue = `一、春天的气息\n` +
        `1. 描述春天的气息，如花香、草木清新等\n` +
        `2. 解释这些气息对人们的影响，如让人心情愉悦、精神焕发等\n\n` +
        `二、春天的景色\n` +
        `1. 描述春天的景色，如万物复苏、百花争艳等\n` +
        `2. 解释这些景色对人们的意义，如代表生命力的重生、美好的希望等\n\n` +
        `三、春天的活动\n` +
        `1. 描述春天的活动，如踏青、赏花、放风筝等\n` +
        `2. 解释这些活动对人们的作用，如增强体质、放松身心等\n\n` +
        `四、春天的文化\n` +
        `1. 描述春天在文化上的意义，如春节、清明节等传统节日\n` +
        `2. 解释这些文化对人们的影响，如弘扬中华文化、传递美好\n`;


    const onNextGenerateBodyText = () => {
        if (!outline) return
        let prompt = `请完成第${bodyText.length + 1}段文章的编写,并在开头标明该段大纲标题。不要超出字数限制`
        if (!prompt || loading) {
            return
        }
        setLoading(true)
        const fetchapiOnce = async () => {
            controller = new AbortController()
            await fetchApiAppliction({
                systemMessageKey: '',
                signal: controller.signal,
                prompt,
                options: {
                    parentMessageId,
                },
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
                        setParentMessageId(data.id)
                        setBodyText([...bodyText, data.text])
                    }
                    catch (error) {
                        //
                    }
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        fetchapiOnce()
    }

    const onGenerateBodyText = () => {
        if (!outline) return
        let prompt = `请更具写作提纲：${outline}, 完成大纲第一段文章的编写,并在开头标明该段大纲标题。不要超出字数限制`
        if (!prompt || loading) {
            return
        }
        setLoading(true)
        setBodyText([])
        setParentMessageId(null)
        const fetchapiOnce = async () => {
            controller = new AbortController()
            await fetchApiAppliction({
                systemMessageKey: '',
                signal: controller.signal,
                prompt,
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
                        setParentMessageId(data.id)
                        setBodyText([data.text])
                    }
                    catch (error) {
                        //
                    }
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        fetchapiOnce()
    }

    const handleClearUpdateArcile = () => {
        setUpdateActicle('');
        setActicle('')
        setRequire('')
    }

    const onGenerateBodyText2 = () => {
        if (!updateActicle) return
        let prompt = `请用${voice}的语气改写下面文字,${require},以下是要改写的内容： ${updateActicle}`
        if (!prompt || loading) {
            return
        }
        setLoading(true)
        setBodyText([])
        setParentMessageId(null)
        const fetchapiOnce = async () => {
            controller = new AbortController()
            await fetchApiAppliction({
                systemMessageKey: '',
                signal: controller.signal,
                prompt,
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
                        setActicle(data.text)
                    }
                    catch (error) {
                        //
                    }
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        fetchapiOnce()
    }

    const onSubmit = () => {
        window._czc.push(["_trackEvent", '创作页面', '点击生成', '成功', 1]);
        if (!writingTheme) return
        let prompt = `请更具写作主题：${writingTheme}, 列出写作的提纲。`
        if (!prompt || loading) {
            return
        }
        setLoading(true)
        // setCopyText("复制")
        setOutline("")
        const fetchapiOnce = async () => {
            controller = new AbortController()
            await fetchApiAppliction({
                systemMessageKey: '',
                signal: controller.signal,
                prompt,
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
                        setOutline(data.text)
                    }
                    catch (error) {
                        //
                    }
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        fetchapiOnce()
    }

    return <div className='creation-page'>
        <div className='creation-head'>
            <Radio.Group value={type} style={{ marginBottom: 16 }}>
                <Radio.Button onClick={() => { setType("写作") }} value="写作">写作</Radio.Button>
                <Radio.Button onClick={() => { setType("改写") }} value="改写">改写</Radio.Button>
                {/* <Radio.Button onClick={()=>{setType("补全")}} value="补全">补全</Radio.Button> */}
            </Radio.Group>
        </div>
        {type == '写作' && <div className='creation-content-wrap'>
            <div className='creation-content'>
                <div className='writer-app'>
                    <div className='writer-app-title'>写作主题</div>
                    <div className='writer-app-dec'>通过作文提纲的方式引导机器人，帮助你撰写各种论文、研究报告等长篇文章，轻松写完1万字。</div>
                    <div className='writer-block'>
                        <Input.TextArea
                            onChange={(e) => {
                                setWritingTheme(e.target.value)
                            }}
                            value={writingTheme}
                            rows={3} placeholder='请输入写作主题，例如：春天'></Input.TextArea>
                        <div className='writer-app-submit-button'>
                            <Button onClick={() => {
                                if(!token) {
                                    setShowLoginModal(true)
                                }
                                onSubmit()
                            }} type='primary'>提交</Button>
                        </div>
                        <div
                            onClick={() => {
                                handleClear()
                            }}
                            className='writer-block-clear'>清空</div>
                    </div>
                    <div className='writer-app-title flex'>
                        写作提纲
                        <div className='writer-app-dec'>（请确认提纲无误后再点击“生成正文”）</div>
                    </div>

                    <div
                        className='writer-block'>
                        <Input.TextArea
                            onChange={() => {
                                setOutline(outline)
                            }}
                            autoSize={true}
                            value={outline}
                            defaultValue={defaultValue} disabled={!outline}></Input.TextArea>
                    </div>
                    {bodyText.length == 0 && outline && <div className='generate-body-text'> <Button
                        onClick={() => {
                            onGenerateBodyText()
                        }}
                        type='primary'>生成正文</Button> </div>}
                    {bodyText.length > 0 && <div className='writer-app-title'>正文</div>}
                    {bodyText.map((item, i) => {
                        return <div key={"_" + i} className='writer-block'>
                            <div className='writer-example-line'>
                                {item}
                            </div>
                        </div>
                    })}
                    {bodyText.length > 0 && outline && <div className='generate-body-text'> <Button
                        onClick={() => {
                            onNextGenerateBodyText()
                        }}
                        type='primary'>继续生成下一段</Button> </div>}
                    {/* <div className='writer-block'>
                    <div className='writer-example-line'>
                        "在春天，大自然的景色也是非常美丽的。万物开始复苏，树木发芽，花儿绽放。整个世界都变得生机勃勃，充满了希望和活力。这些美景对人们有着重要的意义，让人们感受到自然的魅力，也让人们更加珍惜生命的存在。"
                    </div>
                </div> */}
                    <div className='writer-app-title'>可以这样提出您的要求：</div>
                    <ul className="tip-ul">
                        <li className="tip-li">父亲为了子女上学而四处打工的艰辛</li>
                        <li className="tip-li">中国成为世界第二大经济体</li>
                        <li className="tip-li">每个人应追求感情、知识、人格、成就的完整</li>
                        <li className="tip-li">紧密围绕“我的深圳故事”为核心主题，描述平凡真实的身边人、身边物、身边事</li>
                        <li className="tip-li">北京奥运会成功举办、2012年伦敦奥运会取得优异成绩</li>
                        <li className="tip-li">神舟系列发射成功、嫦娥登月计划、蛟龙号深潜成功</li>
                    </ul>

                </div>

            </div>
        </div>}
        {
            type == '改写' && <div className='creation-content-wrap'>
                <div className='creation-content'>
                    <div className='writer-app'>
                        <div className='writer-app-title'>改下原文</div>
                        <div className='writer-app-dec'>保持原义的情况下，大幅度修改原文，广泛应用于SEO、抄袭检测等领域。</div>
                        <div className='writer-block'>
                            <Input.TextArea
                                onChange={(e) => { setUpdateActicle(e.target.value) }}
                                autoSize={true}
                                value={updateActicle}
                                placeholder='请输入想要改写的文章内容（800字内，如超过800字请分成多次提交）'></Input.TextArea>
                            <div className='select-yuqi'>选择语气</div>
                            <div className='search-option-content'>
                                <div onClick={() => {
                                    setVoice('严肃')
                                }} className='search-option-item'>
                                    <div
                                        className={voice != '严肃' ? 'writer-select-button' : 'writer-select-button_select'}>
                                        严肃
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        setVoice('高兴')
                                    }}
                                    className='search-option-item'>
                                    <div
                                        className={voice != '高兴' ? 'writer-select-button' : 'writer-select-button_select'}>
                                        高兴</div>
                                </div>
                                <div
                                    onClick={() => {
                                        setVoice('调皮')
                                    }} className='search-option-item'>
                                    <div
                                        className={voice != '调皮' ? 'writer-select-button' : 'writer-select-button_select'}>
                                        调皮</div>
                                </div>
                                <div
                                    onClick={() => {
                                        setVoice('沮丧')
                                    }} className='search-option-item'>
                                    <div
                                        className={voice != '沮丧' ? 'writer-select-button' : 'writer-select-button_select'}>
                                        沮丧</div>
                                </div>
                                <div
                                    onClick={() => {
                                        setVoice('生气')
                                    }} className='search-option-item'>
                                    <div
                                        className={voice != '生气' ? 'writer-select-button' : 'writer-select-button_select'}>
                                        生气</div>
                                </div>
                            </div>
                            <Divider />
                            <div>
                                <Input value={require} onChange={(e) => setRequire(e.target.v)} placeholder='想要AI如何优化，表达您的想法（选填）'></Input>
                            </div>
                            <div className='writer-flex-between'>
                                <div onClick={()=>{
                                    handleClearUpdateArcile()
                                }} className='writer-clear'>清空</div>
                                <div className='writer-app-submit-button'>
                                    <Button onClick={() => {
                                        onGenerateBodyText2()
                                    }} type='primary'>提交</Button>
                                </div>
                            </div>
                            
                        </div>
                        <div className='writer-block'>
                                <div className='writer-example-line'>
                                    {acticle}
                                </div>
                            </div>
                        <div className='writer-app-title'>可以这样提出您的要求：</div>
                        <ul className="tip-ul">
                            <li className="tip-li">帮我把这段话增加一些古文色彩，体现音韵美。</li>
                            <li className="tip-li">这工作周报太直白了，帮我表达地更正式一些。</li>
                            <li className="tip-li">这工作周报太直白了，帮我表达地更正式一些。</li>
                            <li className="tip-li">希望这段宣传语能简练一些，易读且易记。</li>
                        </ul>
                    </div>
                </div>
            </div>
        }
    </div>
}

export default CreationPage