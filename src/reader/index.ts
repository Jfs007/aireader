
import Base from "../utils/base";
import Text from "./text";
import Video from "./video";
import Openai from "../chatgpt";

import Keyv from 'keyv';

import { v4 } from 'uuid'


/**
 * 
 *  阅读器
 *  
 * 
 * 
 */


interface Field {
    uuid: string
    embed: []
    answer: string
    question: string
}



class Seed extends Base {
    plugins: any = {
        Text,
        Video
    };
    limited: number = 1000;
    maxLimited: number = 1000;
    contextPoint: number = 200;
    packs: Array<any> = [];
    chunks: Array<any> = [];
    store: Keyv = new Keyv({ store: new Map() })
    Openai: Openai = null;
    readend: boolean = false;
    constructor(options: Seed.Options) {
        super(options)
        let min = Math.min(this.maxLimited, options.limited || this.limited);
        options.limited = min;
        super.init(options);
        this.Openai = new Openai({
            openkey: options.openkey,
            agent: options.agent
        })
    }
    feed(data: Array<Text | Video | any>) {
        this.readend = false;
        this.packs.push(...data)
        return this;
    }
    async chunked() {
        let { limited, contextPoint } = this;

        let chunks = [];
        let seed = this;
        let chunksPromise = this.packs.map(pack => {
            async function chunkify() {
                let aloneChunks = [];
                await pack.toString();
                if (pack.text.length <= limited) {
                    chunks.push(pack.text);
                } else {
                    aloneChunks = seed.Cut(pack.text, limited, contextPoint);
                    chunks.push(...aloneChunks);
                }

            }
            return chunkify()
        });
        await Promise.all(chunksPromise);
        this.chunks = chunks;
        return this;
    }

    async summarize() {
        console.log('启动阅读: bi～bi～bi～')
        if (this.readend) {
            console.log('阅读完成: bi～bi～bi～')
            return;
        }
        let openai = this.Openai;
        let l = this.chunks.length;
        if (l <= 1) {
            let uuid = v4();
            this.store.set(uuid, {
                question: '',
                answer: this.chunks[0],
                embed: [],
                uuid
            });
            console.log('阅读完成: bi～bi～bi～')
            this.readend = true;
            return;
        }
        let num = 0;
        let embeds: Array<Field> = [];
        embeds = await Promise.all(this.chunks.map((text) => {
            return new Promise<Field>(async (resolve) => {
                let server = openai.ChatCompletions.talk({
                    messages: [
                        {
                            role: 'user',
                            content: `根据下面给出的内容，提取成关键词问题: ${text}`
                        },
                    ]
                })
                await server.run()
                let content = server.response.data.choices[0].message.content;
                let response = await openai.Embedding.create({
                    input: content
                })
                let embed = response.data.data[0].embedding;
                console.log(`问题已生成: ${content} `)
                console.log(`阅读完成✅度: ${(num + 1) / l * 100}%`)
                num++;
                return resolve({
                    embed,
                    question: content,
                    answer: text,
                    uuid: v4()
                })
            })
        }))
        this.readend = true;
        embeds.map(_ => {
            this.store.set(_.uuid, _)
        })
    }

    cosineSimilarity(embedA, embedB) {
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < embedA.length; i++) {
            dot += embedA[i] * embedB[i];
            normA += embedA[i] * embedA[i];
            normB += embedB[i] * embedB[i];
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        return dot / (normA * normB);
    }

    max(arr) {
        const maxIndex = arr.reduce((maxIndex, currentValue, currentIndex, array) => {
            if (currentValue > array[maxIndex]) {
                return currentIndex;
            } else {
                return maxIndex;
            }
        }, 0);
        return maxIndex;
    }

    async question(options: any = {}) {
        let response = await this.Openai.Embedding.create({
            input: options.input,
        })
        let emb = response.data.data[0].embedding;
        let simFragment = null;
        for await (const [key, value] of this.store.iterator()) {
            let sim = this.cosineSimilarity(emb, value.embed)
            if (!simFragment || sim > simFragment.sim) {
                value.sim = sim;
                simFragment = value
            }
        };
        let serve = this.Openai.ChatCompletions.talk({
            messages: [
                {
                    role: 'assistant',
                    content: `根据下面给出的描述，从中获取答案，并且扮演描述内容的ai助手，如果你的答案和下面描述无关只需要回复'No'不需要回复其余内容`
                },
                {
                    role: 'assistant',
                    content: options.desc || ''
                },
                {
                    role: 'user',
                    content: simFragment.answer
                },
                {
                    role: 'user',
                    content: options.input
                }]
        })
        await serve.run()
        return (serve.response.data.choices[0].message.content)

    }

    /**
     * 
     * 切割字符串
     * 
     * @param text 
     * @param limited 
     * @param contextPoint 
     * @returns 
     */

    Cut(text, limited, contextPoint): Array<string> {
        let str = '';
        let chunks = [];
        let strNum = 0;
        let cacheLastContextPointStr = '';
        for (let value of text) {
            str = str + value; strNum++;
            if (strNum >= (limited - contextPoint) + 1) {
                cacheLastContextPointStr = cacheLastContextPointStr + value;
            };
            if ((strNum) === limited) {
                chunks.push(str);
                str = cacheLastContextPointStr; cacheLastContextPointStr = '';
                strNum = contextPoint;
            }
        };
        if (str && (str.length < limited) && (str.length > contextPoint)) { chunks.push(str) };
        return chunks;

    }

}

export default Seed;