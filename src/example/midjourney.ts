
import { HttpsProxyAgent } from "https-proxy-agent";
import chalk from 'chalk';
import { Client, GatewayIntentBits } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { ProxyAgent } from 'undici'
import fs from 'fs'
import Midjourney from "src/midjourney";
import { FormData } from "node-fetch";
let options: Midjourney.Configuration = {
    agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
    SERVER_ID: '1097741407516635277',
    SALAI_TOKEN: 'MTA3NTI3NjI4Njk2NjEwNDEzNA.GgKRt9.O0xEKhkytqfTKSyzFsg_Nw-S__5B2xWpXtpss8',
    CHANNEL_ID: '1100734545491398676'

}
let midjourney = new Midjourney(options)
async function main() {




    // const TOKEN = 'MTEwNjA5NzM1OTI0MDMxODk3Nw.Gzy9Ia.a4RpzDeZwIjhfvnEPo8LnFUEVyZE_pDyz24jrQ'
    // const CHANNEL_ID = options.CHANNEL_ID
    // const rest = new REST({ version: '10', agent: new ProxyAgent('http://127.0.0.1:7890') }).setToken(TOKEN);
    // try {
    //     console.log(await rest.get(Routes.channelMessages(CHANNEL_ID)));
    // } catch (error) {
    //     console.error(error);
    // }

    // const client = new Client({
    //     intents: [GatewayIntentBits.Guilds], rest: {
    //         agent: new ProxyAgent('http://127.0.0.1:7890')
    //     }
    // });

    // client.on('ready', () => {
    //     console.log(`Logged in as ${client.user.tag}!`);
    // });

    // client.on('error', error => {
    //     console.error('The WebSocket encountered an error:', error);
    // });

    // client.login(TOKEN).catch(error => {
    //     console.error(`An error occurred while logging in: ${error.message}`, error);
    // });;

    //     // client.login(TOKEN)

    // } catch (error) {

    // }
    // return;
    let attachmentsBody = await midjourney.Interactions.describe({
        filePath: __dirname + '/WechatIMG678.png',
    })



    // let v = await midjourney.Channels.sendMessage({
    //     content: '下午好你好啊',
    //     attachments: [attachmentsBody.body]
    // })
    // console.log(v.body.attachments[0].url)
    // let file = fs.createReadStream('./WechatIMG678.png')
    // let formData = new FormData();
    // formData.append('file', file);
    // let _ = formData.get('file')
    // let res = await midjourney.Channels.attachments({
    //     filePath: __dirname + '/WechatIMG678.png',
    //     // file: fs.createReadStream('./WechatIMG678.png')
    // })
    // console.log(res, 'res');


}

main()