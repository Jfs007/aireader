import fetch from 'node-fetch'
/// <reference types="node" />

import { RequestOptions } from 'http';

// type AbortSignal = {
//     readonly aborted: boolean;

//     addEventListener: (type: 'abort', listener: (this: AbortSignal) => void) => void;
//     removeEventListener: (type: 'abort', listener: (this: AbortSignal) => void) => void;
// };

// export type HeadersInit = Headers | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>;


// export interface RequestInit {
//     /**
//      * A BodyInit object or null to set request's body.
//      */
//     body?: BodyInit | null;
//     /**
//      * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
//      */
//     headers?: HeadersInit;
//     /**
//      * A string to set request's method.
//      */
//     method?: string;
//     /**
//      * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
//      */
//     redirect?: RequestRedirect;
//     /**
//      * An AbortSignal to set request's signal.
//      */
//     signal?: AbortSignal | null;
//     /**
//      * A string whose value is a same-origin URL, "about:client", or the empty string, to set request’s referrer.
//      */
//     referrer?: string;
//     /**
//      * A referrer policy to set request’s referrerPolicy.
//      */
//     referrerPolicy?: ReferrerPolicy;

//     // Node-fetch extensions to the whatwg/fetch spec
//     agent?: RequestOptions['agent'] | ((parsedUrl: URL) => RequestOptions['agent']);
//     compress?: boolean;
//     counter?: number;
//     follow?: number;
//     hostname?: string;
//     port?: number;
//     protocol?: string;
//     size?: number;
//     highWaterMark?: number;
//     insecureHTTPParser?: boolean;
// }

// export interface ResponseInit {
//     headers?: HeadersInit;
//     status?: number;
//     statusText?: string;
// }

// export type BodyInit =
//     | Blob
//     | Buffer
//     | URLSearchParams
//     | FormData
//     | NodeJS.ReadableStream
//     | string;
// class BodyMixin {
//     constructor(body?: BodyInit, options?: { size?: number }) {};

//     readonly body: NodeJS.ReadableStream | null;
//     readonly bodyUsed: boolean;
//     readonly size: number;

//     /** @deprecated Use `body.arrayBuffer()` instead. */
//     buffer():Promise<Buffer> {  return null };
//     arrayBuffer(): Promise<ArrayBuffer> { return null };
//     formData(): Promise<FormData> { return null };
//     blob(): Promise<Blob> { return null };
//     json(): Promise<unknown> { return null };
//     text(): Promise<string> { return null };
// }

// // `Body` must not be exported as a class since it's not exported from the JavaScript code.
// export interface Body extends Pick<BodyMixin, keyof BodyMixin> { }

// export type RequestRedirect = 'error' | 'follow' | 'manual';
// export type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
// export type RequestInfo = string | Request;


// type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';

// class Response extends BodyMixin {
// 	constructor(body?: BodyInit | null, init?: ResponseInit) {
//         super()
//     };

// 	readonly headers: Headers;
// 	readonly ok: boolean;
// 	readonly redirected: boolean;
// 	readonly status: number;
// 	readonly statusText: string;
// 	readonly type: ResponseType;
// 	readonly url: string;
// 	clone() {return null};

// 	static error() {};
// 	static redirect(url: string, status?: number) {};
// 	static json (data: any, init?: ResponseInit): Response { return null };
// }


// export class AbortError extends Error {
//     type: string;
//     name: 'AbortError';
//     [Symbol.toStringTag]: 'AbortError';
// }



export default function Fetch(url, init) {
    return fetch(url, init)
}

