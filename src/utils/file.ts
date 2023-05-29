import { nodejs } from './promisify'
import fs from 'fs';
import { resolve } from 'path'


interface File {
    content?: any
    error?: boolean
    message?: string
    path?: string
}

function File(options: File) {
    return {
        content: options.content,
        error: options.error === undefined ? false : options.error,
        message: options.message,
        path: options.path
    }
}


function Resolve(root, pts = []) {
    if (typeof pts == 'string') {
        pts = [pts];
    }
    pts.unshift(root);
    return resolve(...pts);
}


async function read({ path, options, root = __dirname }) {
    try {
        let content = await nodejs(fs.readFile)(Resolve(root, path), Object.assign({
            encoding: 'utf-8'
        }, options || {}));
        return File({ content })

    } catch (error) {
        return File({ content: null, error: true, message: error })
    }

}

async function write({ path, content, root = __dirname }) {
    try {
        let _content = await nodejs(fs.writeFile)(Resolve(root, path), content);
        return File({ content: _content })
    } catch (error) {
        return File({ content, error: true, message: error })
    }
}
async function readdir({ path, root = __dirname }) {
    try {
        let files = await nodejs(fs.readdir)(Resolve(root, path));
        return File({ content: files });
    } catch (error) {
        return File({ content: null, error: true, message: error })
    }
}

async function stat({ path, root = __dirname }) {
    try {
        let Pid = Resolve(root, path);

        let stat = await nodejs(fs.stat)(Pid);

        return File({ content: stat, path: Pid });
    } catch (error) {
        return File({ content: null, error: true, message: error })
    }
}

function type({ path }) {
    let match = path.match(/\..*$/);
    if (match) {
        return File({ content: match[0].split(".").slice(-1)[0] });
    }
    return File({});
}

function name({ path }) {
    let url = path.replace(/.*\/(.*\..*)$/gi, "$1");
    return File({ content: url, })
}







export { read, write, readdir, Resolve, stat, type, name };
