
import { HttpsProxyAgent } from "https-proxy-agent";
import chalk from 'chalk';
import Openai from "src/chatgpt";
let options: Openai.Configuration = {
    agent: new HttpsProxyAgent('http://u287.kdltps.com:15818'),
    openkey: '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',
    accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJxeHhlaHJ4bnhAY29jb2dyYW1ib3kuY2xvdWQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci16YkxnbmZWdU1Bb2JYTjRFc0ZZRlZlaFMifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA2NzI5ODE0NDM4ODI2Njk0NjkwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NDQwMzg0NywiZXhwIjoxNjg1NjEzNDQ3LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9yZ2FuaXphdGlvbi53cml0ZSJ9.fkh2oDUjXG1ITG9MeS30mJWM_W9rEhj7C_vvxHC6kxQP3F57EJA55M893-6FUezUx5cSGDuMldKHE0Xt65KKURe2TbpnP6GPmxImrylnbqkuxNftZlWFWcGz5CDeJtv0VTwBQ5SzYUA6-tJ1NKgUkC8OhmVA5-upM4p9nbn1ujY-RX469RFk__Le2gEDJmwtCXuhtda25BvGIYJvCGEfSl850WdSR-RVEmrMBrrmgrnBxGu5bJaW0yFFGxR-GOr08gnF8cKVBoGHkFneozwepsrcA4qaozb-xZyzMB5Hj8kXPtqiOOn0NNdsA8yGNijWpAl_8JlG7z-TxAkGIe2mpw'
}
let openai = new Openai(options)
let __sigint = () => {}
process.on('SIGINT', function () {
    __sigint();
    console.log('Got SIGINT. Press Control-D/Control-C to exit.');
})

async function talk() {
    let input = process.argv[2];
    let output = '';
    const Controller = new AbortController()
    __sigint = () => {
        console.log('___', 22)
        Controller.abort();
    }
    let res = openai.ChatgptChat.talk({
        stream: true,
        messages: [{
            role: 'user',
            content: input
        }]
    }, {
        signal: Controller.signal
    })
    res.on('push', (payload) => {
        output = (payload.choices[0].delta.content || '')
        console.clear();
        console.log(chalk.green(output))
    })
    res.on('close', (body) => {
        console.log(chalk.yellowBright('回答完毕!'))
        // console.log(body, 32)
    })
    res.on('error', (error) => {
        if (error.status === 503) {
            console.log('正在重发', 35)
            talk()
        }
    })

    res.on('timeout', () => {
        Controller.abort()
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