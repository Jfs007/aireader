



declare namespace Openai {


    import { HttpsProxyAgent } from 'https-proxy-agent'
    type agent = HttpsProxyAgent<any>
    interface Configuration {
        openkey: string
        agent?: agent
        accessToken?: string
    }
    namespace Embedding {
        interface createApi {
            model?: string
            input: string
        }

    }

    namespace Audio {
        interface transcriptions {
            model?: string
            file?: WritableStream<any>
        }
    }

    namespace ChatCompletions {
        interface Message {
            role: 'user' | 'system' | 'assistant'
            content: string

        }

        interface talk {
            model?: string
            messages: Array<Message>
            temperature?: number
            top_p?: number
            n?: number
            stream?: boolean
            stop?: string | Array
            max_tokens?: number
            presence_penalty?: number
            frequency_penalty?: number
            logit_bias?: number
        }
    }

    namespace ChatgptChat {
        interface Message {
            role: 'user' | 'system' | 'assistant'
            content: string
            message_id: string

        }
        interface talk {
            model?: string
            messages: Array<Message>
            conversation_id: string
            parent_message_id: string
            stream?: boolean

        }

    }


}



