import { ReadStream } from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Base from "src/utils/base";

class Reader extends Base {
    type: string = 'reader';
    content: any = null;
    file: ReadStream = null;
    text:string = '';
    agent: HttpsProxyAgent<any> = null;
    constructor(options: Seed.Reader.Options) {
        super(options)
        super.init(options);
    }
    async toString(value?:any, value2?:any): Promise<any> {

    }
}

export default Reader