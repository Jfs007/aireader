
import { HttpsProxyAgent } from "https-proxy-agent";
import chalk from 'chalk';
// import Openai from "src/chatgpt";
import OpenAi from 'src/chatgpt'
let options: Openai.Configuration = {
    agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
    openkey: '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',
    accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiIyMTkxNjIyNjIwQHFxLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLXBQczI5amV6TjRLRmxzMTlESWtwUUpCcSJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDA3Nzk4MDgzNTIwMjA3MTE1NjciLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjg2NTUxNTM5LCJleHAiOjE2ODc3NjExMzksImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb3JnYW5pemF0aW9uLndyaXRlIn0.DXlG3nRxQv3HjaxwVYE1KktvNjPwiu-y46wNZZTpXYkk3RzVa5zmbo_6Wql3Lqngl2SkFz5oaE32D7jxxtuqGORJnC8GORFoOgzd1Bzin5L2iV45qggXXWoTarpehy-cMpkBBj0RZSpAArYD9l23OWsOGF51Q82VI-6EnEni8vsuA2AT5HQkBXTBkcNCO63rncgCRgS8u4g93RoZwewYWEs8EAUE2quTIAiDBfSHHRysKkLAXjZStYe7mOzS6rAWjPmBRVX-QMwhwoVKFnbsI_F3v8p6C-UW2d_r8bk6A8BoE1LHaUqp24cJSGlZwlTtZ1csjXNVIUnN8dDeGv-Z-w'
}
let openai = new OpenAi(options)
let __sigint = () => { }
process.on('SIGINT', function () {
    __sigint();
    console.log('Got SIGINT. Press Control-D/Control-C to exit.');
})

async function talk() {
    // let input = process.argv[2];

    // input ='10字title'
    let output = '';
    const Controller = new AbortController()
    __sigint = () => {
        console.log('___', 22)
        Controller.abort();
    }
    // let i = `现在你需要总结这个微博“四川大学称将依规依纪处理;导语：川大回应：已密切联系属地警方及当事学生了解核实情况，将按程序依规依纪处理;#四川大学称将依规依纪处理# 近日，广州地铁8号线“大叔被疑偷拍自证清白后仍被曝光”事件引发关注。6月11日，该女子@注册不了张z 公开道歉。记者今天从四川大学了解到，学校对此高度重视，已密切联系属地警方及当事学生了解核实情况，将按程序依规依纪处理​​​”，下面会发送给你评论，你先转化为数组，然后根据语境帮我逐条分析评论，并且把正负面结果(正面返回"正面",负面返回"负面",中性返回"中性")，以及所属多个情绪用中文返回，帮我整理为如下格式[{ sentiment: "正面",  emotion: "生气", index: "" }]index要和输入的评论下标对应返回 ，注意只要返回数组json就可以`
    let res = openai.ChatCompletions.talk({
        stream: false,
        messages: [
      
        {
            role: 'user',
            content: "结合这个话题“四川大学称将依规依纪处理;导语：川大回应：已密切联系属地警方及当事学生了解核实情况，将按程序依规依纪处理;#四川大学称将依规依纪处理# 近日，广州地铁8号线“大叔被疑偷拍自证清白后仍被曝光”事件引发关注。6月11日，该女子@注册不了张z 公开道歉。记者今天从四川大学了解到，学校对此高度重视，已密切联系属地警方及当事学生了解核实情况，将按程序依规依纪处理​​​”解答我后面的内容。"
        },
        {
            role: 'assistant',
            content: `好的,我会根据你的话题结合意图去解答下面23条内容,分析讽刺/生气/嘲讽/开心/悲伤/担忧等情感，并只返回结构如下 1."正面"@"生气、愤怒"`
        }, 
        
        { "role": "user", "content": "这条“这人是在校生，学校应该处罚她。这人是党员，组织应该处罚她。这人是网民，平台应该处罚她。”结合话题，根据格式返回正负面和情感" },
        { "role": "user", "content": "这条“不愧是学新闻的，没有新闻制造新闻”结合话题，根据格式返回正负面和情感" },
        { "role": "user", "content": "这条“我知道嫖娼，开黄腔的男的都退学了。该处理就处理，别双标。”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“先开除党籍，至于网暴他人，有现成的法律。更有现成的案例。”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“图片评论”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“四川观察终于观察四川了”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“开了吧，纯纯的坏”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“只能说她的职业不普通，还没进入社会就能带动社会的力量网暴别人，进入社会还不知道怎么指鹿为马。只能说她希望落在大叔身上的事落在了她自己身上。”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“不开除党籍就是沆瀣一气”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“上次四川大学的学生被外校体育生打，后续咋样了呢？”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“我们都在等待处理结果”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“蹲一个不和稀泥的处理结果，这女学生诽谤转评赞远超500”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“虚心接受大家批评=对方隐私无法评论。 深深歉意=开小号评论+设置精选第一条 真的错了=我怕了但我没有错，我还要继续洗”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“既然是新闻学院的，建议开除，终生不得从事新闻工作”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“是依法保送还是依法发奖学金呢”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“我觉得这位女士是真的感到错误，就主动退党免得让党的声誉蒙羞，主动退学免得学校声誉受损”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“最起码开除党籍，就这样的品行简直可怕”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“很多农民工吃饭或者平时都是爱蹲着的，而且看当时情况也没有座位，胳膊肘和膝关节抵着是蹲着最好的玩手机姿势，手机必然是高一点的，这个女生是有多少漂亮，多自恋或者是多坏才会这么想啊”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“此保送女太欺负人了，不讲道德，应该整整歪风邪气”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“从心里的坏”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“这毕业了，就是个祸害”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“专业对口，过程熟练，培养的很好，很优秀，将来在新闻行业大有作为”结合话题，根据格式返回正负面和情感" }, 
        { "role": "user", "content": "这条“只有处罚才能警示后来者，不要制造所谓的“新闻”为自己搏眼球。也只有处罚才能让以后真正被偷拍的人可以正确的维权。”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“四川大学你妈死了”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“为四川大学赚足了关注度，这不保博说不过去吧？”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“四川大学确实需要对违法违纪者作出处置，不然四川大学的声誉恐怕要损失”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“开除学籍党籍，影响太恶劣了”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“川大很给力啊，既能招聘学术妲己，又能培养新闻狂魔”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“严肃处理”结合话题，根据格式返回正负面和情感" }, 
        // { "role": "user", "content": "这条“作为该专业的高等学生应该比普通人更具有这方面的意识。看了完整视频和这位学者的表述，很明显是在制造舆论…己的专业优势而发挥错误的舆论效果，这样只会害人。所以必须得严惩，才能给相关专业的人做到更好的警醒。”结合话题，根据格式返回正负面和情感" },
    ]
    }, {
        signal: Controller.signal
    })
    // 评论进行处理 对每个单条分析一下正负面，并且逐条进行如下 { sentiment: "正面",  emotion: "生气", index: "", content: "" } 格式输出
    // res.on('push', (payload) => {
    //     output = (payload.choices[0].delta.content || '')
    //     console.clear();

    //     console.log(chalk.green(output))
    // })
    res.on('close', (body) => {
        
        let content = body.choices[0].message.content;
        console.log(content)
        let info = content.split('\n').map(result => {
            let [_, index, sentiment, emotion] = result.match(/(\d+)\.\s?["|“]?(正面|负面|中性|贬义)\s?["|“]?\s?[@|、|,|，]?\s?["|“]?(.+)["|“]?/) || []
            return {
                sentiment,
                emotion,
                index
            }
        })
        console.log(info)

        // const v = content.match(/```json([\s\S]*)```/)
        


        // if (v) {
        //     console.log(JSON.parse(v[1].trim()))
        // } else {
        //     console.log(JSON.parse(content))
        // }
    })
    res.on('error', (error) => {
        console.log(error, 'error')
        if (error.status === 503) {
            console.log('正在重发', 35)
            talk()
        }
    })

    res.on('timeout', () => {
        // Controller.abort()
        console.log(chalk.redBright('timeout!'))
    })
    let response = await res.run();

    return res;

}


async function main() {

    talk()
    // console.log(response.message)

}

main()