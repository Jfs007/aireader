
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
        let body = {
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
        options.model = this.model || options.model;
        let HttpController = options.stream ? ChatgptHttpEventSource : Http;
        let sse = new HttpController(`${this.api}api/conversation`);
        sse.setHeaders(this.headers);
        sse.setProxy(this.configuration.agent);
        sse.setSignal(fetchOptions?.signal);
        sse.setBody(JSON.stringify(body));
        sse.setOptions(fetchOptions);
        return sse;
    }











}

export default ChatgptChat;