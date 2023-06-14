import HttpEventSource from '../../utils/http/sse';


class ChatgptHttpEventSource extends HttpEventSource {


    constructor(url) {
        super(url);
    }

    onPush(payload: any) {
        let response: any = null;
        try {
            if (payload === '[DONE]') {
                super.onClose(response);
                return;
            }
            response = JSON.parse(payload || '{}');
            response.choices = [{ delta: { content: response.message?.content?.parts[0] } }]
            super.onPush(response);
        } catch (error) {
        } finally {
            return this;
        }

    }

}

export default ChatgptHttpEventSource