
import OpenAiApi from "./openai-api";
import { v4 as uuidv4 } from 'uuid';

import { ChatgptHttpEventSource, Http } from '../http';


class ChatgptChat extends OpenAiApi {
    public model: string = 'text-davinci-002-render-sha'
    public api: string = 'https://ai.fakeopen.com/'
    get headers() {
        return {
            Authorization: `Bearer ${this.configuration.accessToken}`,
            'Content-Type': `application/json`
        } as any
    }
    constructor(configuration: ConstructorParameters<typeof OpenAiApi>[0]) {
        super(configuration);
    }
    talk(options: Openai.ChatgptChat.talk, fetchOptions: any = {}) {
        let stream:any = options.stream
        if(stream === false) {
            stream = false
        }
        let body = {
            "stream": stream || false,
            "action": "next",
            "conversation_id": options.conversation_id || undefined,
            "messages": options.messages.map(message => {
                return {
                    "id": message.message_id || uuidv4(),
                    "role": message.role,
                    "author": {
                        "role": message.role,
                    },
                    "content": {
                        "content_type": "text",
                        "parts": [
                            message.content
                        ]
                    }
                }

            }),
            "model": this.model,
            "parent_message_id": options.parent_message_id || uuidv4()
        }
        options.model = options.model || this.model;
        let HttpController = options.stream ? ChatgptHttpEventSource : Http;
        let sse = new HttpController(`${this.api}api/conversation`);
        if(!options.stream) {
            sse.setResponse(async res => {
                let text = await res.text();
                let answer = text.replace(/data\: \[DONE\]/g, ' ').split('data: ').slice(-1)[0]
                let r = JSON.parse(answer);
                r.choices = [{ delta: { content: r.message?.content?.parts[0] } }]
                return r;
            })
            sse.setTimeoutMs(200 * 1000)
        }
        sse.setHeaders(this.headers);
        sse.setProxy(this.configuration.agent);
        sse.setSignal(fetchOptions?.signal);
        sse.setBody(JSON.stringify(body));
        sse.setOptions(fetchOptions);
        return sse;
    }











}

export default ChatgptChat;