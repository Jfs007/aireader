
import fetch from "node-fetch";
function main() {
    async function fetchChatList() {
        try {
            while (true) {
                const response = await fetch("https://api.ai.tommmd.com/chat/chatList");
                const data = await response.text();
                console.log(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    fetchChatList();

}

main()
