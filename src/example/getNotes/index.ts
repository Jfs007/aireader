
import fetch from "node-fetch";
import { HttpsProxyAgent } from 'https-proxy-agent'
import fs from 'fs'
import chalk from 'chalk';
async function main() {
    let listText = fs.readFileSync(__dirname + '/exec', 'utf-8');
    let noteList = listText.split('\n').filter(_ => _.trim()).map(_ => _.trim())
    const notePath = __dirname + '/note.json'
    let noteJsonText = fs.readFileSync(notePath, 'utf-8');
    let noteJson = JSON.parse(noteJsonText);
    noteList = noteList.filter(_ => !noteJson[_])
    
    let sleep = (t) => {
        return new Promise(resolve => {
            setTimeout(resolve, t)
        })
    }
    let l = 0;
    const sleepTimeMs = 0;
    console.log(chalk.greenBright(`共${noteList.length}条小红书，预计耗时${noteList.length * (500 + sleepTimeMs) / 1000}s, 现在开始读取.....`))
    console.log(chalk.greenBright('bi～bi～bi～'))
    async function getNoteInfo(url) {
        if (l == noteList.length) {
            console.log(chalk.yellowBright(`读取完成。`))

            
            return;
        };
        await sleep(sleepTimeMs);
        let res = await fetch('https://api.sc.tommmd.com/v1/account/crawler', {
            method: 'post',
            agent: new (HttpsProxyAgent as any)(`http://u287.kdltps.com:15818`),
            body: JSON.stringify({
                target: url.trim()
            }),
            headers: {
                'Content-Type': `application/json`,
                Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZWZhdWx0XzY0NmNjY2Q2YzkxY2U0Ljg5NTE0NzI0IiwiaWF0IjoxNjg0ODUxOTI2LCJuYmYiOjE2ODQ4NTE5MjYsImV4cCI6MTY5MzQ5MTkyNiwiaWQiOiI0NjA4ODI3NjYxOTI1NjIxNzYiLCJudW1iZXIiOiJYMjIxMjAwMDIiLCJuYW1lIjoiaXQiLCJoZWFkX3Bob3RvIjoiaHR0cDpcL1wvdG0teGluZ2p1Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb21cL3VwbG9hZHNcLzIwMjIxMjEyMTkwMzI2NjQzMzEyLmpwZyIsIm9wZW5pZCI6Im83aE5nNUxvbG5qSUd5aVkyOEZoeTVSWWJJMmciLCJ3ZWNoYXQiOiJqb2pvIiwid2VjaGF0X29wZW5pZCI6Im9HMlpmNkt5SW5taWw2cHFMTkNTQktaLUJCbkEiLCJ1bmlvbmlkIjoib3BwaGV3aVRYb0dDY0lpQzJxZVZzeXZFakljZyIsImFwcGxlX29wZW5pZCI6bnVsbCwibW9iaWxlIjoiMTgxMDAxNzU0OTAiLCJlbWFpbCI6bnVsbCwicGxhdGZvcm0iOlsxXSwiYmFkZ2UiOm51bGwsInN0YXR1cyI6MSwiY3JlYXRlZF9hdCI6IjE2NzA4NDMwMTQiLCJ1cGRhdGVkX2F0IjoiMTY4NDQ2NjA0MCIsImRlbGV0ZWRfYXQiOm51bGwsInJlbmV3X3RpbWUiOiIyMDIzLTA1LTE5Iiwid2FybSI6MSwid2FybV9qb2luX3RpbWUiOjE2NzU4MzUxOTcsIndhcm1fY2hlY2tfdGltZSI6MTY3NTgzNTQ1OCwiand0X3NjZW5lIjoiZGVmYXVsdCJ9.qetj1Ifm51O8uWJu0cChgq9Ae1tFQ_M45hnbwWG9inE'
            }
        })
        let json: any = await res.json();
        if (json.code == 200) {
            let data = json?.data;
            let noteJsonText = fs.readFileSync(notePath, 'utf-8');
            let noteJson = JSON.parse(noteJsonText);
            noteJson[url] = data;
            console.log(chalk.greenBright(`笔记${url}读取成功!!!`))
            fs.writeFileSync(notePath, JSON.stringify(noteJson))
        }else {
            console.log(chalk.redBright(`笔记${url}读取失败!!!`))
        }
        l++;
        console.log(chalk.greenBright(`进度完成${(l/noteList.length * 100).toFixed(2)}`))
        await getNoteInfo(noteList[l]);
    }
    getNoteInfo(noteList[l]);

}


main()