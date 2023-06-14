
import OpenAiApi from "./openai-api"
import FormData from 'form-data'
class Audio extends OpenAiApi {
    public model: string = 'whisper-1'
    constructor(configuration: ConstructorParameters<typeof OpenAiApi>[0]) {
        super(configuration);
    }
    get headers() {
        return {
            Authorization: `Bearer ${this.configuration.openkey}`,
            // 'Content-Type': `multipart/form-data`
        }
    }
    async transcriptions(options: Openai.Audio.transcriptions) {
        options.model = options.model || this.model;
        const formData = new FormData()
        Object.keys(options).map(key => {
            let value = options[key];
            formData.append(key, value);
        })
        try {

            let response = await this.fetch(`${this.api}audio/transcriptions`, {
                method: 'post',
                body: formData,
                headers: this.headers
            })
            if(response.status!=200) throw response
            let body = await response.json()

            return {
                status: 200,
                data: body
            }
        } catch (error) {
            console.log(error, 46)
            return error
        }

    }

}

export default Audio;