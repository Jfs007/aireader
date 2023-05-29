



import Base from "src/utils/base";
import Configuration from "./configuration";
import Channels from "./service/channels";
import Interactions from './service/interactions'


const modules = [Channels, Interactions]


/**
 *  new Configuration({})
 *  
 *  new Midjourney()
 * 
 */


class Midjourney extends Base {
    Channels
    Interactions
    constructor(configuration: Midjourney.Configuration) {
        let _config = new Configuration(configuration);
        super(_config);
        modules.map(module => {
            this[module.name] = new module(_config)
        })
    }

}

// Midjourney = InstanceType<typeof Openai> & 

export default Midjourney;