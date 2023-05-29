import Base from "src/utils/base"

class Configuration extends Base {

    SERVER_ID: Midjourney.Configuration["SERVER_ID"]
    SALAI_TOKEN: Midjourney.Configuration["SALAI_TOKEN"]
    CHANNEL_ID: Midjourney.Configuration["SALAI_TOKEN"]
    agent?: Midjourney.Configuration["agent"]
    constructor(options: Midjourney.Configuration) {
        super(options)
        super.init(options)
    }

    update(options: Midjourney.Configuration) {
        super.init(options)
        return this;
    }


}

export default Configuration