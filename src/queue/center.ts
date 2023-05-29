
import Base from "src/utils/base";
import Counter from "./counter"




class Center extends Base {
    counters: Array<Counter> = []
    constructor() {
        super()
    }
    getFastCounter(options?: {
        cuid: string
    }) {
        let fastCounter: Counter = null;
        this.counters.map(counter => {
            if (options && options.cuid && options.cuid !== counter.cuid) {
                return void 0
            }
            if (!fastCounter) fastCounter = counter;
            if (counter.length < fastCounter.length) {
                fastCounter = counter
            }
        })
        return fastCounter
    }
    add(counter: Counter) {
        this.counters.push(counter)
        return this
    }
}

export default Center