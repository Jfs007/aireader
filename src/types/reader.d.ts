


declare namespace Seed {
    import { HttpsProxyAgent } from 'https-proxy-agent';
    import { ReadStream } from "fs"
    import Openai from '../chatgpt/index'
    type Options = {
        limited?: number
        contextPoint?: number
    } & Openai.Options



    namespace Reader {
        type Options = {
            content?: any
            file?: ReadStream
            agent?: HttpsProxyAgent<any>
            openai?: Openai
            openkey?: string
        }

    }





}