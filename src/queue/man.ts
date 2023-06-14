import Counter from "./counter";

import Base from "src/utils/base";




class Man extends Base {
    name: string
    __serve: Function
    __counter: Counter
    __next: Function
    receptioning: boolean = false
    constructor(options: any = {}) {
        super()
        super.init(options)
    }
    onServe(__serve) {
        this.__serve = __serve
    }

    serve(next): void {
        this.__serve && this.__serve(next)
    }

    // 执行任务
    async do(counter?: Counter) {
        counter = this.__counter || counter
        this.receptioning = true;
        // next函数只允许执行一次
        // 防止 开发者多次 next
        let next: any = () => {
            if (next.void) return;
            counter.next.call(counter)
            next.void = true;
            // this.__next = null;
        }
        next.void = false;
        this.__next = next;
        this.serve(next)
    }


    next() {
        this.__next && this.__next()
    }

    doEnd() {
        this.receptioning = false;
    }



    onMessage(counter: Counter, info: any) {
        // custom
    }
    // 离开当前队列或者结束当前服务
    leave(counter?: Counter) {
        this.receptioning = false;
        (this.__counter || counter).unsub(this);
    }


}


export default Man