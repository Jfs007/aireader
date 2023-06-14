import EventEmitter from 'events';
import { ReadStream } from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Keyv from 'keyv';

declare class Base {
    uuid: string;
    E: EventEmitter;
    constructor(options?: any);
    init(options?: any): void;
    on(name: string, listener: (...args: any[]) => any): this;
    emit(name: string, ...args: any[]): this;
}

declare class Reader extends Base {
    type: string;
    content: any;
    file: ReadStream;
    text: string;
    agent: HttpsProxyAgent<any>;
    constructor(options: Seed.Reader.Options);
    toString(value?: any, value2?: any): Promise<any>;
}

declare class Text extends Reader {
    type: string;
    constructor(options: Seed.Reader.Options);
    toString(): Promise<void>;
}

/**
 *  new Configuration({})
 *
 *  new Openai()
 *
 */
declare class Openai extends Base {
    Audio: any;
    ChatCompletions: any;
    Embedding: any;
    ChatgptChat: any;
    constructor(configuration: Openai.Configuration);
}

declare class Video extends Reader {
    type: string;
    openkey: string;
    openai: Openai;
    constructor(options: Seed.Reader.Options);
    toString(): Promise<unknown>;
}

declare class Seed$1 extends Base {
    plugins: any;
    limited: number;
    maxLimited: number;
    contextPoint: number;
    packs: Array<any>;
    chunks: Array<any>;
    store: Keyv;
    Openai: Openai;
    readend: boolean;
    constructor(options: Seed$1.Options);
    feed(data: Array<Text | Video | any>): this;
    chunked(): Promise<this>;
    summarize(): Promise<void>;
    cosineSimilarity(embedA: any, embedB: any): number;
    max(arr: any): any;
    question(options?: any): Promise<any>;
    /**
     *
     * 切割字符串
     *
     * @param text
     * @param limited
     * @param contextPoint
     * @returns
     */
    Cut(text: any, limited: any, contextPoint: any): Array<string>;
}

/**
 *  new Configuration({})
 *
 *  new Midjourney()
 *
 */
declare class Midjourney extends Base {
    Channels: any;
    Interactions: any;
    constructor(configuration: Midjourney.Configuration);
}

declare class Man extends Base {
    name: string;
    __serve: Function;
    __counter: Counter;
    __next: Function;
    receptioning: boolean;
    constructor(options?: any);
    onServe(__serve: any): void;
    serve(next: any): void;
    do(counter?: Counter): Promise<void>;
    next(): void;
    doEnd(): void;
    onMessage(counter: Counter, info: any): void;
    leave(counter?: Counter): void;
}

declare class Counter extends Base {
    name: string;
    cuid: string;
    mans: Array<Man>;
    info: any;
    runMan: Man;
    id: string;
    get length(): number;
    constructor(options?: {});
    sub(man: Man): void;
    unsub(man: Man): void;
    next(): void;
    notice(): void;
}

declare class Center extends Base {
    counters: Array<Counter>;
    constructor();
    getFastCounter(options?: {
        cuid: string;
    }): Counter;
    add(counter: Counter): this;
}

declare const _default: {
    Counter: typeof Counter;
    Center: typeof Center;
    Man: typeof Man;
};

export { Midjourney, Openai as OpenAi, _default as Queue, Seed$1 as Reader };
