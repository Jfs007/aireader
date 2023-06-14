
import MidjourneyApi from "./midjourney-api"
import FormData from 'form-data'
import fs from 'fs'
import path from 'path';
import mime from 'mime';




class Channels extends MidjourneyApi {

    constructor(configuration: ConstructorParameters<typeof MidjourneyApi>[0]) {
        super(configuration);
    }
    async attachments(options) {
        let filePath: string = options.filePath
        let file = fs.readFileSync(filePath);
        let file_size = file.length
        let filename = path.basename(filePath)
        let mimeType = mime.getType(filePath)
        filename = `${options.id || this.generateNumericNonce()}_${filename}`
        console.log()
        
        try {
            let AttachmentResponse = await this.fetch(`${this.api}/channels/${this.configuration.CHANNEL_ID}/attachments`, {
                method: 'post',
                headers: this.headers,
                body: JSON.stringify({ "files": [{ "filename": filename, "file_size": file_size, "id": options.attachments_id || "0" }] })
            })
            if (AttachmentResponse.status != 200) throw AttachmentResponse
            let AttachmentResponseJson: any = await AttachmentResponse.json()
            let { id, upload_url, upload_filename } = AttachmentResponseJson.attachments[0]
            // 上传文件
            await this.fetch(`${upload_url}`, {
                method: 'put',
                body: file,
                headers: {
                    'content-type': mimeType
                }
            })
            return {
                status: 200,
                body: {
                    filename,
                    uploaded_filename: upload_filename,
                    id,
                }
            }
        } catch (error) {
            return error
        }


    }



    async sendMessage(options: Midjourney.Channels.sendMessage) {
        try {

            let bodyOptions = Object.assign({
                "channel_id": "" + this.configuration.CHANNEL_ID,
                "nonce": this.generateNumericNonce(),
                "type": 0,
                "sticker_ids": [],
                "attachments": []
            }, options)
            // console.log(bodyOptions, 'bodyOptions')
            let response = await this.fetch(`${this.api}/channels/${this.configuration.CHANNEL_ID}/messages`, {
                method: 'post',
                headers: this.headers,
                body: JSON.stringify(bodyOptions)
            })
            if (response.status != 200) throw response
            let body = await response.json()
            return {
                body,
                status: 200
            }

        } catch (error) {
            return error
        }




    }


}

export default Channels;