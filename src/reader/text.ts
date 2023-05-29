import Reader from "./reader";

class Text extends Reader {
    type = "text";

    constructor(options: Seed.Reader.Options) {
        super(options)
        super.init(options);
        this.toString();
    }
    async toString() {
        this.text = this.content;
    }

}

export default Text;