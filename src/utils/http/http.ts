
import fetch from './fetch'
import EventEmitter from "events"
import Base from '../base'
import { HttpsProxyAgent } from "https-proxy-agent"
import pTimeout from 'p-timeout'
/**
 * 
 * new HttpEventSource("http:0.0.0.0").setProxy().start()
 * 
 * 
 */
class Http extends Base {
    url: string = ''
    uid: string = ''
    __inEnd = false
    __stage = ''
    proxy: HttpsProxyAgent<any> = null;
    headers: any = {
        'Content-Type': 'application/json'
    }

    signal: AbortSignal = null

    body: any = {}

    timeoutMs: number = 15 * 1000

    options: Parameters<typeof fetch>[1] = {}

    __responseResolve: Function = null;
    __responseHandle: Function = async (res) => res.json();
    response: any = {

    };



    constructor(url: string) {
        super()
        this.url = url
    }

    setHid(id) {
        this.uid = id
        return this
    }

    setProxy(proxy: HttpsProxyAgent<any>) {
        this.proxy = proxy
        return this
    }

    setHeaders(headers) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }

    setSignal(signal) {
        this.signal = signal
        return this
    }

    setUrl(url) {
        this.url = url
        return this
    }

    setBody(body) {
        this.body = body;
        return this
    }

    setOptions(options) {
        this.options = options
        return this
    }

    setTimeoutMs(timeoutMs) {
        this.timeoutMs = timeoutMs
        return this
    }


    setResponse(handle: Function) {
        this.__responseHandle = handle
    }


    setup() {
        this.__inEnd = false;

    }

    async run() {
        try {
            this.setup();

            let decorateFetch = pTimeout(fetch(this.url, {
                method: 'post',
                agent: this.proxy,
                headers: this.headers,
                ...this.options,
                body: this.options.body || this.body,
            }),
                this.timeoutMs,
                () => {
                    this.response.status = 503
                    this.response.code = 503
                    this.response.message = 'TIMEOUT'
                    try {
                        // 执行延后，保证 throw timeout Error!

                        this.onTimeout()
                    } catch (error) {

                        // ignore
                    }
                    throw this.response
                }

            )

            const res = await decorateFetch;

            this.response = {
                message: res.statusText,
                status: res.status,

            }

            this.__responseResolve && this.__responseResolve(res);
            
            if (res.status == 200) {
                let body = null;
                try {
                    body = await this.__responseHandle(res)
                } catch (error) {
                    // console.log(error, 'body')
                } finally {
                    this.onClose(body);
                }



            } else {

                this.response.type = 'ERROR'
                this.onError(this.response);
            }
        } catch (error) {

            this.response = {
                type: 'ERROR',
                status: error.code || 500,
                message: error.message || error.statusText
            }
            this.onError(this.response);

        } finally {
            return this.response;
        }

    }



    responseBody() {
        return new Promise((resolve) => {
            this.__responseResolve = resolve;
        })
    }


    onPush(payload, type?: string) {
        if (this.__inEnd) return this
        this.emit('push', payload, type)
        return this
    }

    onError(payload, type?: string) {
        if (this.__inEnd) return this;
        this.__inEnd = true;
        this.emit('error', payload, type)
        return this
    }


    onConnect(payload, type?: string) {
        this.emit('connect', payload, type)
        return this
    }

    onClose(payload, type?: string) {
        if (this.__inEnd) return this;
        this.__inEnd = true;
        this.emit('close', payload, type)
        return this
    }

    onTimeout(payload?: string, type: string = 'TIMEOUT') {
        if (this.__inEnd) return this;
        this.__inEnd = true;
        this.emit('timeout', payload, type)
        return this
    }


}







export default Http
