
import OpenAiApi from "./openai-api"
class Embedding extends OpenAiApi {
    public model: string = 'text-embedding-ada-002'
    constructor(configuration: ConstructorParameters<typeof OpenAiApi>[0]) {
        super(configuration);
    }
    async create(options: Openai.Embedding.createApi) {
        options.model = options.model || this.model;
        try {
            let response = await this.fetch(`${this.api}embeddings`, {
                method: 'post',
                body: JSON.stringify(options),
                headers: this.headers
            })
            if(response.status!=200) throw response
            let body = await response.json()
            return {
                status: response.status,
                data: body
            }
        } catch (error) {
            return error
        }

    }

}

export default Embedding;