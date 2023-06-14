import Base from "src/utils/base";
import Man from "./man"



// D------  D---------- D---------- 


class Counter extends Base {
    name: string = '';
    cuid: string = ''
    mans: Array<Man> = []
    info: any = {}
    runMan: Man;
    id: string
    get length() {
        let runManNum = this.runMan ? 1 : 0
        return this.mans.length + runManNum
    }

    constructor(options = {}) {
        super()
        super.init(options)
    }
    sub(man: Man) {
        man.__counter = this
        this.mans.push(man)
        if (this.runMan && this.runMan.receptioning) {
            // 推送一下
            this.notice();
            return;
        };
        this.next();
    }
    unsub(man: Man) {
        let index = this.mans.findIndex(m => man === m)
        man.__counter = null
        if (man === this.runMan) {
            this.next();
        } else {
            this.mans.splice(index, 1);
        }
    }

    next() {
        if (this.runMan) {
            this.runMan.doEnd()
        }
        this.runMan = this.mans.shift();
        if (this.runMan) {
            this.runMan.do(this)
            this.notice();
        }
    }
    notice() {
        this.mans.map((man, i) => {
            !man.receptioning && man.onMessage(this, {
                length: this.mans.length,
                wait: i
            })
        })


    }










}


export default Counter