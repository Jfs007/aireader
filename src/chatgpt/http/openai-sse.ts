import HttpEventSource from '../../utils/http/sse';


class OpenaiHttpEventSource extends HttpEventSource {


    constructor(url) {
        super(url);
    }

    onPush(payload: any) {
        let response:any = null;
        try {
            if(payload === '[DONE]') {
                super.onClose(response);
                return;
            }
            response = JSON.parse(payload);
            super.onPush(response); 
        } catch (error) {
            // super.onPush({}); 
        } finally {
            return this;
        }
        
    }

}

export default OpenaiHttpEventSource