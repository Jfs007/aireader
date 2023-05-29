// import axios from 'axios'
import fetch from "node-fetch"
import chalk from "chalk";

async function main() {

    // const service = axios.create({
    //     baseURL: 'http://127.0.0.1:7003'
    // })
    // client 

    async function talk(options: any = {}) {
        let controller = new AbortController()
        let res = await fetch('http://127.0.0.1:7003/api/visit', {
            method: 'post',
            signal: controller.signal,
            body: JSON.stringify({
                name: options.name,
                input: options.input
            }),
            headers: {
                'Content-Type': `application/json`,
            },
        })
        let body = res.body;
        body.on('readable', () => {
            let chunk: string | Buffer | null = body.read()
            while (chunk) {
                let ar = chunk.toString().replace(/}{/g, '}\n{').split('\n')
                let text = ar[ar.length - 1];
                let data: any = JSON.parse(text)
                if (data.type == 'QUEUE') {
                    console.log(chalk.yellowBright(`${options.name}需要排队，需要等待${data.wait + 1}, 队伍长度${data.length}....`))
                }
                if (data.type == 'MESSAGE') {
                    console.log(chalk.greenBright(data.content))
                }
                if (data.type == 'ERROR') {
                    console.log(chalk.redBright(data.message))
                }
                if (data.type == 'TIMEOUT') {
                    console.log(chalk.greenBright('TIMEOUT'))
                }
                chunk = body.read();
            }
        })
        return {
            res,
            controller
        }
        // console.log(await res.text(), '1')

        // body.on('end', () => {

        // })


        // await service({
        //     url: '/api/visit',
        //     method: 'post',
        //     signal: controller.signal,

        //     // responseType: 'blob',
        //     // responseType: 'text',
        //     data: {
        //         name: options.name,
        //         input: options.input
        //     },
        //     onDownloadProgress(v) {
        //         console.log(v)
        //         // console.log(`${v.loaded / v.total * 100}%`, 'v');
        //     }
        // })



    }

    talk({
        name: '访问1 ' + Date.now(),
        input: '你好，我是访问1，请提到我' 
    })

    await talk({
        name: '访问2 ' + Date.now(),
        input: '你好，我是访问2，请提到我' 
    })
    talk({
        name: '访问3 ' + Date.now(),
        input: '你好，我是访问3，请提到我' 
    })

    talk({
        name: '访问4 ' + Date.now(),
        input: '你好，我是访问4，请提到我' 
    })

    talk({
        name: '访问5 ' + Date.now(),
        input: '你好，我是访问5，请提到我' 
    })
    talk({
        name: '访问6 ' + Date.now(),
        input: '你好，我是访问6，请提到我' 
    })
    talk({
        name: '访问7 ' + Date.now(),
        input: '你好，我是访问7，请提到我' 
    })
    talk({
        name: '访问8 ' + Date.now(),
        input: '你好，我是访问8，请提到我' 
    })
    // talk({
    //     name: '访问9' + Date.now(),
    //     input: '写个30字小说'
    // })
    // talk({
    //     name: '访问10' + Date.now(),
    //     input: '写个20字小说'
    // })
}
main()