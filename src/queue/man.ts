import Counter from "./counter";

import Base from "src/utils/base";




class Man extends Base {
    name: string
    __serve: Function
    __counter: Counter
    receptioning: boolean = false
    constructor(options: any = {}) {
        super()
        super.init(options)
    }
    onServe(__serve) {
        this.__serve = __serve
    }

    serve(next): void {
        this.__serve(next)
    }

    // 执行任务
    async do(counter?: Counter) {
        counter = this.__counter || counter
        this.receptioning = true;
        // next函数只允许执行一次
        let next: any = () => {
            if (next.void) return;
            counter.next.bind(counter)
            next.void = true;
        }
        next.void = false;
        this.serve(next)
    }

    doEnd() {
        this.receptioning = false;
    }



    onMessage(counter: Counter, info: any) {
        // custom
    }

    leave(counter?: Counter) {
        this.receptioning = false;
        (this.__counter || counter).unsub(this);
    }


}


export default Man