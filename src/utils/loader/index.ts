import Base from "../base";
import { readdir, stat as FileStat } from '../file';
import fs from 'fs';

interface Options {
    dirname: string
    filter: Array<RegExp>
}

class defaultSyncLoader extends Base {
    modules: Array<any> = []
    dirname: Options["dirname"]
    filter: Options["filter"]
    constructor(options: Options) {
        super()
        super.init(options)

    }
    run() {
        let dirnameFiles = fs.readdirSync(this.dirname);

        let filter = this.filter;

        let files = dirnameFiles.filter(dirName => {
            return !!!(filter.find(regex => {
                return !regex.test(dirName)
            }))

        });
        let loads = file => {
            try {
                let path = `${this.dirname}/${file}`;
                let _def = require(path).default
                return _def
            } catch (error) {
                // ignore
            }
        }
        this.modules = (files.map(file => {
            return loads(file);
        }));
        return this;
    }



}

export default defaultSyncLoader