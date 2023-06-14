
import OpenAiApi from "./openai-api";

import { OpenaiHttpEventSource, Http } from '../http';


class ChatCompletions extends OpenAiApi {
    public model: string = 'gpt-3.5-turbo'
    constructor(configuration: ConstructorParameters<typeof OpenAiApi>[0]) {
        super(configuration);
    }
    talk(options: Openai.ChatCompletions.talk, fetchOptions: any = {}) {
        options.model = options.model || this.model;
        let HttpController = options.stream ? OpenaiHttpEventSource : Http;
        let sse = new HttpController(`${this.api}chat/completions`);
        sse.setHeaders(this.headers);
        sse.setProxy(this.configuration.agent);
        sse.setSignal(fetchOptions?.signal);
        sse.setBody(JSON.stringify(options));
        sse.setOptions(fetchOptions);
        sse.setTimeoutMs(200 * 1000)
        return sse;
    }








}

export default ChatCompletions;