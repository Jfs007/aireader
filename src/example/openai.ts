
import { HttpsProxyAgent } from "https-proxy-agent";
import chalk from 'chalk';
import Openai from "src/chatgpt";
let options: Openai.Configuration = {
    agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
    openkey: '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'
}
let openai = new Openai(options)
async function main() {
    let input = process.argv[2];
    let output = '';
    const Controller = new AbortController()
    let res = openai.ChatCompletions.talk({
        stream: true,
        messages: [{
            role: 'user',
            content: input
        }]
    }, {
        signal: Controller.signal
    })
    res.on('push', (payload) => {
        output += (payload.choices[0].delta.content || '')
        console.clear();
        console.log(chalk.green(output))
    })
    res.on('close', (body) => {
        console.log(chalk.yellowBright('回答完毕!'))
        // console.log(body, 32)
    })

    res.on('error', (error) => {
        console.log(error, 35)
    })

    res.on('timeout', () => {
        Controller.abort()
        console.log(chalk.redBright('timeout!'))
    })
    let response = await res.run();
    console.log(response.status)

}

main()