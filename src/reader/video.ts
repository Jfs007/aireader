import Reader from "./reader";
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Openai from "src/chatgpt";

class Video extends Reader {
    type = "video";
    openkey: string = '';
    openai: Openai = null;
    constructor(options: Seed.Reader.Options) {
        super(options)
        if (!options.openai) {
            this.openai = new Openai({
                agent: options.agent,
                openkey: options.openkey
            })
        }
        super.init(options);
    }
    async toString() {
        return new Promise((resolve, reject) => {
            let tmpFile = `${__dirname}/.tmp/${uuidv4()}.mp3`;
            // 读取音频
            ffmpeg(this.file).noVideo().on('end', async () => {
                try {
                    let response = await this.openai.Audio.transcriptions({
                        file: fs.createReadStream(tmpFile)
                    })
                    this.text = response.data.text;
                    console.log(this.text)
                    resolve(response.data.text)
                } catch (error) {
                    reject('')
                } finally {
                    fs.unlinkSync(tmpFile)
                }

            }).output(tmpFile).run();

        })
    }


}

export default Video;