import express from 'express'
import chalk from 'chalk'


/**
 * 
 *  s1
 *  s2
 * 
 */


import { HttpsProxyAgent } from "https-proxy-agent";
import Openai from "src/chatgpt";
let options: Openai.Configuration = {
    agent: new HttpsProxyAgent('http://u287.kdltps.com:15818'),
    openkey: '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',

}


import { Center, Counter, Man } from 'src/queue'



const openai = new Openai(options)

const app = express()
const router = express.Router()

app.use(express.static('public'))
// app.use(cors())
app.use(express.json())





app.all('*', (_, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.header("Access-Control-Allow-Methods", "*");
    next()

})



let center = new Center()

center.add(new Counter({
    name: '服务台1号',
    cuid: 'qxxehrxnx@cocogramboy.cloud',
    info: {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJxeHhlaHJ4bnhAY29jb2dyYW1ib3kuY2xvdWQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci16YkxnbmZWdU1Bb2JYTjRFc0ZZRlZlaFMifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA2NzI5ODE0NDM4ODI2Njk0NjkwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NDQwMzg0NywiZXhwIjoxNjg1NjEzNDQ3LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9yZ2FuaXphdGlvbi53cml0ZSJ9.fkh2oDUjXG1ITG9MeS30mJWM_W9rEhj7C_vvxHC6kxQP3F57EJA55M893-6FUezUx5cSGDuMldKHE0Xt65KKURe2TbpnP6GPmxImrylnbqkuxNftZlWFWcGz5CDeJtv0VTwBQ5SzYUA6-tJ1NKgUkC8OhmVA5-upM4p9nbn1ujY-RX469RFk__Le2gEDJmwtCXuhtda25BvGIYJvCGEfSl850WdSR-RVEmrMBrrmgrnBxGu5bJaW0yFFGxR-GOr08gnF8cKVBoGHkFneozwepsrcA4qaozb-xZyzMB5Hj8kXPtqiOOn0NNdsA8yGNijWpAl_8JlG7z-TxAkGIe2mpw'
    }

}))



class HttpMan extends Man {
    response: any = null;
    constructor(options) {
        super(options)
        super.init(options)
    }
    onMessage(_: Counter, info: any): void {
        this.response.write(JSON.stringify(Object.assign(info, {
            type: 'QUEUE'
        })))
    }
}


router.post('/visit', (request, response) => {
    let body = request.body;
    let counter = center.getFastCounter({
        cuid: body.token_account
    });
    const man = new HttpMan({
        name: body.name,
        response
    });
    response.setHeader('Content-type', 'text/event-stream')
    response.setHeader('keep-alive', true);
    // 发送空包
    response.write('{}')

    let controller = new AbortController()


    response.socket.on('close', _ => {
        controller.abort();
        // 发起中断信号
        man.leave();
    })
    man.onServe(async (next) => {

        let http = openai.ChatgptChat.talk({
            stream: true,
            messages: [{
                role: 'user',
                content: body.input
            }]
        })
        http.setOptions({
            signal: controller.signal
        })
        http.setHid(body.name)
        http.setHeaders({
            Authorization: `Bearer ${counter.info.accessToken}`
        })
        http.on('push', (payload) => {
            let content = (payload.choices[0].delta.content || '')
            response.write(JSON.stringify({
                content,
                type: 'MESSAGE'
            }))
        })
        http.on('error', (error) => {
            controller.abort()
            try {
                if (error.status === 503) {
                    controller = new AbortController()
                    http.setOptions({
                        signal: controller.signal
                    })
                    http.run()
                } else {
                    error.type = 'ERROR'
                    response.write(JSON.stringify(error))
                    response.end()
                    next()
                }

            } catch (error) {
                console.log(error, 'error');
                response.end()
            }

        })
        http.on('timeout', (error) => {
            controller.abort()
            next()
            response.write(JSON.stringify({
                type: 'TIMEOUT'
            }));
            response.end()
        })
        http.on('close', () => {
            next()
            response.end();
        })
        try {
            await http.run()
        } catch (error) {
            // response.end()
        }


    })
    counter.sub(man)

})

app.use('/api', router);

app.set('trust proxy', 1)


app.listen(7003, () => console.log(chalk.yellowBright('Server is running on port 7003')))




