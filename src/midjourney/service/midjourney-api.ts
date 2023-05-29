
import Base from "src/utils/base"
import fetch from "node-fetch"
import Configuration from "../configuration"
class MidjourneyApi extends Base {
    public api: string = 'https://discord.com/api/v9/'
    public model: string = ''
    configuration: Configuration = new Configuration({
        SERVER_ID: '',
        SALAI_TOKEN: '',
        CHANNEL_ID: ''
    })
    constructor(options: Configuration) {
        super(options);
        this.configuration = options;
    }
    get headers() {
        return {
            authorization: `${this.configuration.SALAI_TOKEN}`,
            'Content-Type': `application/json`,
        } as any
    }
    fetch(url: string, options: Parameters<typeof fetch>[1]) {
        options.agent = options.agent || this.configuration.agent
        options.signal = options.signal
        return fetch(url, options);
    }
    generateNumericNonce(length = 19) {
        const characters = '0123456789';
        let nonce = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            nonce += characters.charAt(randomIndex);
        }
        return nonce;
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

export default MidjourneyApi;