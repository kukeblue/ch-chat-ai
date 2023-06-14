import React from 'react'
import './index.less'
import { Button, Input, Radio, Tabs } from 'antd';

function CreationPage() {
    return <div className='creation-page'>
        <div className='creation-head'>
            <Radio.Group value="small" onChange={()=>{}} style={{ marginBottom: 16 }}>
                <Radio.Button value="small">写作</Radio.Button>
                <Radio.Button value="middle">改写</Radio.Button>
                <Radio.Button value="large">补全</Radio.Button>
            </Radio.Group>
        </div>
        <div className='creation-content'>
            <div className='writer-app'>
                <div className='writer-app-title'>写作主题</div>
                <div className='writer-app-dec'>通过作文提纲的方式引导机器人，帮助你撰写各种论文、研究报告等长篇文章，轻松写完1万字。</div>
                <div className='writer-block'>
                    <Input.TextArea rows={3} placeholder='请输入写作主题，例如：春天'></Input.TextArea>
                    <div className='writer-app-submit-button'>
                        <Button  type='primary'>提交</Button>
                    </div>
                    <div className='writer-block-clear'>清空</div>
                </div>
                <div className='writer-app-title flex'>
                    写作主题
                    <div className='writer-app-dec'>（请确认提纲无误后再点击“生成正文”）</div>
                </div>
                <div className='writer-block'>
                    <div className='writer-example-line'>一、春天的气息</div>
                    <div className='writer-example-line'>1. 描述春天的气息，如花香、草木清新等。</div>
                    <div className='writer-example-line'>2. 解释这些气息对人们的影响，如让人心情愉悦、精神焕发等。</div>
                    <br/>
                    <div className='writer-example-line'>二、春天的景色</div>
                    <div className='writer-example-line'>1. 描述春天的景色，如万物复苏、百花争艳等。</div>
                    <div className='writer-example-line'>2. 解释这些景色对人们的意义，如代表生命力的重生、美好的希望等。</div>
                    <br/>
                    <div className='writer-example-line'>三、春天的活动</div>
                    <div className='writer-example-line'>1. 描述春天的活动，如踏青、赏花、放风筝等。</div>
                    <div className='writer-example-line'>2. 解释这些活动对人们的作用，如增强体质、放松身心等。</div>
                    <br/>
                    <div className='writer-example-line'>四、春天的文化</div>
                    <div className='writer-example-line'>1. 描述春天在文化上的意义，如春节、清明节等传统节日。</div>
                    <div className='writer-example-line'>2. 解释这些文化对人们的影响，如弘扬中华文化、传递美好</div>
                    {/* <Input.TextArea disabled></Input.TextArea> */}
                </div>
                <div className='writer-app-title'>正文</div>
                <div className='writer-block'>
                    <div className='writer-example-line'>
                        "春天是一年四季中最美好的季节之一。当寒冷的冬天渐渐离去，春天的气息便随之而来。春天的气息充满了生机和活力，让人心情愉悦、精神焕发。在春天的清晨，我们可以感受到花香和草木清新的气息，这些气息让我们感觉到大自然的魅力和美好，也让我们更加热爱生命。"
                    </div>
                </div>
                <div className='writer-block'>
                    <div className='writer-example-line'>
                        "在春天，大自然的景色也是非常美丽的。万物开始复苏，树木发芽，花儿绽放。整个世界都变得生机勃勃，充满了希望和活力。这些美景对人们有着重要的意义，让人们感受到自然的魅力，也让人们更加珍惜生命的存在。"
                    </div>
                </div>
                <div className='writer-app-title'>可以这样提出您的要求：</div>
                <ul class="tip-ul">
                    <li class="tip-li">父亲为了子女上学而四处打工的艰辛</li>
                    <li class="tip-li">中国成为世界第二大经济体</li>
                    <li class="tip-li">每个人应追求感情、知识、人格、成就的完整</li>
                    <li class="tip-li">紧密围绕“我的深圳故事”为核心主题，描述平凡真实的身边人、身边物、身边事</li>
                    <li class="tip-li">北京奥运会成功举办、2012年伦敦奥运会取得优异成绩</li>
                    <li class="tip-li">神舟系列发射成功、嫦娥登月计划、蛟龙号深潜成功</li>
                </ul>

            </div>

        </div>
    </div>
}

export default CreationPage