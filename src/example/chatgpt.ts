
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
        model: 'gpt-3.5-turbo-0613',
        stream: false,
        messages: [
      
        {
            role: 'user',
            content: "下午好"
        },
      
       
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