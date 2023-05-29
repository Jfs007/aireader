import Base from "src/utils/base"

class Configuration extends Base {
    openkey:Openai.Configuration["openkey"]
    agent?: Openai.Configuration["agent"]
    accessToken?: Openai.Configuration["accessToken"]
    constructor(options: Openai.Configuration) {
        super(options)
        super.init(options)
    }

    update(options: Openai.Configuration) {
        super.init(options)
        return this;
    }


}

export default Configuration