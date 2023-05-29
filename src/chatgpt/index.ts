



import Base from "src/utils/base";
import Configuration from "./configuration";
import Audio from "./service/audio";
import ChatCompletions from "./service/chat-completions";
import Embedding from "./service/embedding";
import ChatgptChat from "./service/chatgpt-chat";

// import defaultLoader from "src/utils/loader";
// let loader = new defaultLoader({
//     dirname: __dirname + '/service',
//     filter: [/.ts/, /^(?!openai-api\.ts$)/]
// }).run()

const modules = [Audio, ChatCompletions, Embedding, ChatgptChat]



/**
 *  new Configuration({})
 *  
 *  new Openai()
 * 
 */


class Openai extends Base {
    Audio
    ChatCompletions
    Embedding
    ChatgptChat
    constructor(configuration: Openai.Configuration) {
        let _config = new Configuration(configuration);
        super(_config);
        modules.map(module => {
            this[module.name] = new module(_config)
        })
    }

}

// tOpenai = InstanceType<typeof Openai> & 

export default Openai;