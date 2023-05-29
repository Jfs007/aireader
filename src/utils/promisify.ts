let nodejs = (func) => {
    function ify(...args) {
        return new Promise((resolve, reject) => {
            args.push(function (error, value) {
                if (error) {
                    reject(error)
                } else {
                    resolve(value === undefined ? true : value);
                }
            });
            return func(...args);
        });
    }
    return ify;

}


let shelljs = (func) => {
    function ify(...args) {
        return new Promise((resolve, reject) => {
            args.push(function (code, stdout, stderr) {
                if (code != 0) {
                    reject({ content: stderr })
                } else {
                    resolve({ content: stdout.replace(/\n$/, '') });
                }
            });
          
            return func(...args);
        });
    }
    return ify;
}

export {
    nodejs,
    shelljs
}

