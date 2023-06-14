import express from 'express'
import history from 'connect-history-api-fallback';
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import request from 'request-promise';


const app = express()
app.use('/', history())
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})
let systemMessageMap = {
  default: '你是一个智能助手, 可以帮助用户回答任何问题。你的版本是基于openai的3.5模型。',
  dailyReport: '我希望你充当日报生成器,根据发送的工作内容，生成日报。',
  email: "我希望你充当邮件生成器,根据发送的内容，生成邮件模版。",
  videoFoot: "我希望你充当短视频脚本生成器,根据发送的内容，生成短视频脚本。",
  travel: "我希望你充当旅行计划生成器，根据发送旅游要求，生成旅游计划。",
  apologize: "我希望你充当文本生成器，根据给的句子，用大白话重新解释。",
  knowledge: "我希望你充当百科全书,根据发送的内容，回答问题。",
  dictionary: "我希望你充当中英词典,根据您提供的中英文单词，给出翻译和2个造句。",
  littleRedBook: "我希望你根据提供的内容，生成小红书的Emoji风格文案。",
  littleRedBookTitle: "我希望你根据提供的内容，生成6个小红书风格的标题。",
  meituan: "我希望你根据提供的内容，生成大众点评、美团的风格探店打卡文案。",
  taobao: "我希望你根据提供的内容，生成淘宝、京东买家详细丰富的商品评论，200字以内。",
  zhihu: "我希望你根据提供的问题，生成知乎风格回答，500字以内。",
  pyq: "我希望你根据提供的内容，生成带格式适合朋友圈传播文案",
  goodDetail: "我希望你根据提供的商品,自动生成用于主图和详情页的设计文案",
  barChart: "我希望你根据提供的内容，用echarts生成饼图的json代码，不要有任何代码提示",
  ganChart: "我希望你根据提供的内容，用Mermaid生成图表的mermaid代码，不要有任何代码提示",
  buddhism: "我希望你充当佛学专家,根据您提供的内容，用佛学的知识提供解释。",
  traditionalChineseMedicine: "我希望你充当中医医生,根据您提供的内容，分析病因和给出治疗方案。",
  westernMedicine: "我希望你充当西医专家,根据您提供的内容，分析病因和给出治疗方案。",
  poet: "我希望你充当一个诗人,根据您提供的内容，作一首诗。",
  counselor: "我希望你充当一个心里咨询师,根据您提供的内容，提供积极有效的心理健康指导和建议。",
  lawyer:"我希望你充当一个中国的法律顾问,根据您提供的内容，提供法律方面的帮助和建议。",
  programmer: "我希望你充当一个程序员,根据您提供的内容，专业的写代码工具，可以生成代码，也可以帮你检查代码问题，解释代码逻辑。",
  coaxGirlfriend: "我想让你担任关系教练。我将提供有关冲突中的两个人的一些细节，而你的工作是就他们如何解决导致他们分离的问题提出建议。这可能包括关于沟通技巧或不同策略的建议，以提高他们对彼此观点的理解。",
  singleDog:"我想让你担任关系教练。我将提供有关冲突中的两个人的一些细节，而你的工作是就他们如何解决导致他们分离的问题提出建议。这可能包括关于沟通技巧或不同策略的建议，以提高他们对彼此观点的理解。",
  bless: "我希望你充当祝福生成器，根据提供的内容，以用户的角度生成祝福语。",
  dream: "我想让你扮演一个解梦专家。我会告诉你我的梦境。我希望你根据您的梦境，分析您的当前运势。",
  reply: "我想让你担任关系教练。我将提供一些对话，而你的工作是回复对话，高情商拒绝而不伤和气。",
  shakeThePot: "我希望你根据提供的内容，帮我分析如何推卸责任。",
  praise: "我想让你担任夸夸助手，我将提供一些内容，你来生成夸奖的话。",
  quarrel: "我想让你担任吵架助手，我将提供一些内容，你根据这些内容改成吵架的话。",
  planning: "我希望你根据提供的内容，围绕企划内容目标，以表格方式撰写商业企划书。",
  requirementsDocument: "我希望你根据提供的内容，撰写产品需求文档。",
  decision: "我希望你根据提供的内容，撰写公司战略决策。",
  recruitment: "我希望你根据提供岗位名称给出该岗位所需要的技能，和应聘者需要回答的问题。"


  
}
const getSystemMessage = (key?) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  if(!key) {
    return systemMessageMap.default
  }
  if(systemMessageMap[key]) {
    return systemMessageMap[key] + "当前的时间是" + formattedDateTime + "。"
  }else {
    return systemMessageMap.default
  }
}

let systemMessage = ""

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  let newSystemMessage = getSystemMessage()
  try {
    const { prompt, options = {}, temperature, top_p } = req.body as RequestProps
    
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage: newSystemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/chat-appliction', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, temperature, top_p, systemMessageKey} = req.body as RequestProps
    systemMessage = getSystemMessage(systemMessageKey)
    // console.log('do-chat-process', prompt, options, systemMessage, temperature, top_p)
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: {},
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature: 0.8,
      top_p: 1,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/manage/*', async (req, res) => {
  let authorization = 'Bearer ' + req.headers.authorization
  var options = {
    'method': 'POST',
    'url': 'http://47.106.217.43:8090' + req.path.slice(7),
    'headers': {
      'authorization': authorization,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(req.body)
  };
  let response
  try {
    response = await request(options);
  }catch(err) {
    console.log(err.message)
    if(err.message.includes('401')) {
      res.send({
          code: 401,
          msg: 'Token is expired',
          data: null
      })
      return
    }
  }
  res.send(response)
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
