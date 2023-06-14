
import fetch from './fetch'
import { createParser } from 'eventsource-parser'
import Http from './http';
import pTimeout from 'p-timeout'

/**
 * 
 * new HttpEventSource("http:0.0.0.0").setProxy().start()
 * 
 * 
 */
class HttpEventSource extends Http {

	streamTimeoutMs: number = 4 * 1000
	streamTimer: any = null;
	constructor(url: string) {
		super(url);
	}

	async run() {

		clearTimeout(this.streamTimer);
		this.streamTimer = null;
		super.setup()
		try {


			let decorateFetch = pTimeout(fetch(this.url, {
				method: 'post',
				agent: this.proxy,
				headers: this.headers,
				...this.options,
				body: this.options.body || this.body,
			}), this.timeoutMs,
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
			);
			const res = await decorateFetch
			const parser = createParser((event) => {
				if (event.type == 'event') {
					try {
						this.onPush(event.data)
					} catch (error) {
						// ignore
					}
				}
			})

			const Timeout = () => {
				this.streamTimer = setTimeout(() => {
					// 如果请求已被终止就不执行超时
					if (this.signal && this.signal.aborted) {
						this.resetStreamTimer();
						return;
					}
					this.onTimeout();
				}, this.streamTimeoutMs)
			}

			// feed超时判定

			const feed = (chunk: string) => {
				clearTimeout(this.streamTimer)
				this.streamTimer = null;
				Timeout();
				parser.feed(chunk)
			}
			this.response = {
				message: res.statusText,
				status: res.status,
			}
			this.__responseResolve && this.__responseResolve(res);
			
			if (res.status == 200) {
				let body = res.body;
				body.on('readable', () => {
					let chunk: string | Buffer | null = body.read()
					while (chunk) {
						feed(chunk.toString())
						chunk = body.read();
					}
				})
				this.onConnect(res);
			} else {
				this.response.type = 'ERROR'
				this.onError(this.response);
			}
		} catch (error) {
			this.resetStreamTimer();
			this.response = {
				type: 'ERROR',
				status: error.code || 500,
				message: error.message || error.statusText
			}
			this.onError(this.response);

		}
		return this.response;

	}
	resetStreamTimer() {
		clearTimeout(this.streamTimer)
		this.streamTimer = null;
	}

	onClose(payload: any, type?: string) {
		this.resetStreamTimer()
		super.onClose(payload, type)
		return this
	}
	onError(payload: any, type?: string): this {
		this.resetStreamTimer()
		super.onError(payload, type);
		return this;
	}

	onConnect(payload: any, type?: string): this {
		this.resetStreamTimer()
		super.onConnect(payload, type);
		return this
	}

	onTimeout(payload?: any, type?: string): this {
		super.onTimeout(payload, type);
		return this
	}



}







export default HttpEventSource
