



declare namespace Midjourney {
    import { HttpsProxyAgent } from 'https-proxy-agent'
    type agent = HttpsProxyAgent<any>
    interface Configuration {
        SERVER_ID: string
        SALAI_TOKEN: string
        CHANNEL_ID: string
        agent?: agent
    }

    
    namespace Channels {
        interface attachment {
            filename: string 
            uploaded_filename: string
            id: number
        }
        interface sendMessage {
            attachments?:Array<attachment>
            content?: string
            type?: number
        }

    }



}



