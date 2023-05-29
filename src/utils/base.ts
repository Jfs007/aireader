
import EventEmitter from "events"
import { v4 } from 'uuid'
export default class Base {
    uuid:string =  v4()
    E: EventEmitter = new EventEmitter()
    constructor(options: any = {}) {
        // this.init(options)
    }
    init(options: any = {}) {
        for (let key in options) {
            this[key] = options[key];
        }
    }

    on(name: string, listener: (...args: any[]) => any) {
        this.E.on(name, listener)
        return this;
    }
    emit(name:string, ...args: any[]) {
        this.E.emit(name, ...args)
        return this
    }
}