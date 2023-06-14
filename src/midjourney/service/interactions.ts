import FormData from 'form-data'
import MidjourneyApi from "./midjourney-api"
import Channels from "./channels";

class Interactions extends MidjourneyApi {

    constructor(configuration: ConstructorParameters<typeof MidjourneyApi>[0]) {
        super(configuration);
    }
    async describe(options) {
        try {
            let channels = new Channels(this.configuration)
            let response = await channels.attachments(options)
            // channels.sendMessage({
            //     attachments: [response.body]
            // })

            
            // https://discord.com/api/webhooks/1112305836333735978/ckXJvKYqNlKNqwe0Rr-rz63Ny32205y2e-UCNU7zqmBgjbNqbAU_o_DLrBJkBBhmkRSm
            response.body.id = options.id
            let c_id = "1092492867185950852"
            let reqid = this.generateNumericNonce()
            let payload_json = {
                id: reqid,
                "type": 2,
                "application_id": "936929561302675456",
                "guild_id": this.configuration.SERVER_ID,
                "channel_id": this.configuration.CHANNEL_ID,
                "session_id": "4701bfa0e1e25c7acb7fe1ec6b8daba7",
                // content: this.generateNumericNonce(),
                attachments: [response.body],
                "data": {
                    "version": "1092492867185950853",
                    "id": c_id,
                    "name": "describe",
                    "type": 1,
                    "options": [
                        { "type": 11, "name": "image", "value": 0 }
                    ],
                    "application_command": {
                        "id": c_id,
                        "application_id": "936929561302675456",
                        "version": "1092492867185950853",
                        "default_member_permissions": null,
                        "type": 1,
                        "nsfw": false,
                        "name": "describe",
                        "description": "Writes a prompt based on your image.",
                        "dm_permission": true,
                        "contexts": null,
                        "options": [
                            { "type": 11, "name": "image", "description": "The image to describe", "required": true }
                        ]
                    },
                    "attachments": [response.body]
                },
                "nonce": reqid
            }
            let res = await this.fetch(`${this.api}interactions`, {
                method: 'post',
                body: JSON.stringify(payload_json),
                headers: this.headers
            })

            let body = res.body;
            body.on('readable', () => {
                let chunk: string | Buffer | null = body.read()
                while (chunk) {
                    console.log(chunk.toString())

                    chunk = body.read();
                }
            })
            if (res.status === 200 || res.status === 204) {
                return {
                    status: res.status
                }
            }
            throw res

        } catch (error) {
            return error

        }

    }


}

export default Interactions;