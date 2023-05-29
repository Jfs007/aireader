while True:
    import requests

    url = "https://api.ai.tommmd.com/chat/chatList"
    response = requests.get(url)
    print(response.text)
    # print(response)