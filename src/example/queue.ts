// import express from 'express'
import chalk from "chalk";
import Center from "src/queue/center";
import Counter from "src/queue/counter";
import Man from "src/queue/man";

function main() {
    let sleep = (t = 1000) => new Promise(resolve => setTimeout(() => resolve, t))
    function Serve(next, man) {
        let max = 3;
        let counter = 0;
        async function feed() {
            if (counter >= max) {
                console.log(chalk.bgBlackBright(`${man.name}完成了服务...`))
                next()
                return;
            }
            await sleep(1000)
            feed();
            counter++
        }
        feed()
    }
    let center = new Center();
    let counter1 = new Counter({
        name: '服务台1'
    });
    let counter2 = new Counter({
        name: '服务台2'
    });
    let counter3 = new Counter({
        name: '服务台3'
    });
    let counter4 = new Counter({
        name: '服务台4'
    });
    let counter5 = new Counter({
        name: '服务台5'
    });
    center.add(counter1).add(counter2).add(counter3).add(counter4).add(counter5);
    class MyMan extends Man {
        serve(next): void {
            console.log(chalk.yellowBright(`${this.name}进入服务中...`))
            Serve(next, this);
            // return Serve()
        }
        onMessage(counter, info) {
            console.log(chalk.greenBright(`${this.name}正在${counter.name}排队:当前队列长度${info.length};需要等待${info.wait}`))
        }

    }
    new Array(10).fill(1).map((_, i) => {
        const name = `皮卡丘${i + 1}号`
        let counter = center.getFastCounter();
        console.log(chalk.bgBlue(`${name}去${counter.name}排队======当前排队${counter.length}`))
        counter.sub(new MyMan({
            name
        }))
    })












    // new Man({}, {}, () => {

    // })

}

main()