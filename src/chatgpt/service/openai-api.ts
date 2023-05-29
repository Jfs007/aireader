
import Base from "src/utils/base"
import fetch from "node-fetch"
import Configuration from "../configuration"
class OpenaiApi extends Base {
    public api: string = 'https://api.openai.com/v1/'
    public model: string = ''
    configuration: Configuration = new Configuration({
        openkey: ''
    })
    constructor(options: Configuration) {
        super(options);
        this.configuration = options;
    }
    get headers() {
        return {
            Authorization: `Bearer ${this.configuration.openkey}`,
            'Content-Type': `application/json`,
        } as any
    }
    fetch(url: string, options: Parameters<typeof fetch>[1]) {
        options.agent = options.agent || this.configuration.agent
        options.signal = options.signal
        return fetch(url, options);
    }

    onPush(payload) {
        this.E.emit('push', payload)
        return this
    }

    onError(payload) {
        this.E.emit('error', payload)
        return this
    }


    onConnect(payload) {
        this.E.emit('connect', payload)
        return this
    }

    onClose(payload) {
        this.E.emit('close', payload)
        return this
    }

    onTimeout() {
        this.E.emit('timeout', '')
        return this
    }

}

export default OpenaiApi;