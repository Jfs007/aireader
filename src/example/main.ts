

import Openai from "src/chatgpt";
import Configuration from 'src/chatgpt/configuration';
import { HttpsProxyAgent } from "https-proxy-agent";

import Seed from "src";


import fs from 'fs';

let options: Openai.Configuration = {
    agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
    openkey: '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'
}

const seed = new Seed({

    ...options
    // openkey: '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'

})

async function readVideo() {
    let [a, b, input, videoPath] = process.argv;
    let video = new seed.plugins.Video({
        file: fs.createReadStream(__dirname + videoPath),
        ...options
    });
    await seed.feed([video]).chunked()

    await seed.summarize();

    console.log(await seed.question({ input }))


}








function main() {
    // quesion(process.argv[2]);
    readVideo()


}
main()