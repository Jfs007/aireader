
import { Client, GatewayIntentBits } from 'discord.js';
import Midjourney from "src/midjourney";
import { HttpsProxyAgent } from 'https-proxy-agent';
import "dotenv/config";
let options: Midjourney.Configuration = {
    agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
    SERVER_ID: '1097741407516635277',
    SALAI_TOKEN: 'MTA3NTI3NjI4Njk2NjEwNDEzNA.G7O2W-.kzZLpqcPbA4P4c6mzMjfLAR4pC2XlgYZqGxRHA',
    CHANNEL_ID: '1097741407516635285'

}
let midjourney = new Midjourney(options)
async function main() {
    // const TOKEN = process.env.BOT_TOKEN
    // const CHANNEL_ID = options.CHANNEL_ID   
    // const client = new Client({
    //     intents: [GatewayIntentBits.Guilds], rest: {

    //     }
    // });

    // client.on('ready', () => {
    //     console.log(`Logged in as ${client.user.tag}!`);
    // });

    // client.on('message', async interaction => {
      
    //     console.log(interaction, 'it')
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
    // let attachmentsBody = await midjourney.Interactions.describe({
    //     filePath: __dirname + '/WechatIMG678.png',
    //     attachments_id: "17",
    //     id: "0"
    // })

    let res = await midjourney.Channels.attachments({
        filePath: __dirname + '/WechatIMG678.png',
        // file: fs.createReadStream('./WechatIMG678.png')
    })
    // console.log(res, 'res');

    // let v = await midjourney.Channels.sendMessage({
    //     content: '下午好你好啊',
    //     attachments: [{
    //         "filename": "ID8101229089175717285_ddc0fc0d4a3cd38d1669a519a6718882.png",
    //         "uploaded_filename": "9311b124-541e-4b94-9671-0c6c3f624373/ID8101229089175717285_ddc0fc0d4a3cd38d1669a519a6718882.png",
    //         "id": 17
    //     }]
    // })
    // console.log(v.body.attachments[0].url)
    // let file = fs.createReadStream('./WechatIMG678.png')
    // let formData = new FormData();
    // formData.append('file', file);
    // let _ = formData.get('file')
   
    // console.log(res, 'res');


}

main()