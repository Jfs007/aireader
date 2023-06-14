var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Midjourney: () => midjourney_default,
  OpenAi: () => chatgpt_default,
  Queue: () => queue_default,
  Reader: () => reader_default2
});
module.exports = __toCommonJS(src_exports);

// src/utils/base.ts
var import_events = __toESM(require("events"));
var import_uuid = require("uuid");
var Base = class {
  constructor(options = {}) {
    this.uuid = (0, import_uuid.v4)();
    this.E = new import_events.default();
  }
  init(options = {}) {
    for (let key in options) {
      this[key] = options[key];
    }
  }
  on(name, listener) {
    this.E.on(name, listener);
    return this;
  }
  emit(name, ...args) {
    this.E.emit(name, ...args);
    return this;
  }
};

// src/reader/reader.ts
var Reader = class extends Base {
  constructor(options) {
    super(options);
    this.type = "reader";
    this.content = null;
    this.file = null;
    this.text = "";
    this.agent = null;
    super.init(options);
  }
  async toString(value, value2) {
  }
};
var reader_default = Reader;

// src/reader/text.ts
var Text = class extends reader_default {
  constructor(options) {
    super(options);
    this.type = "text";
    super.init(options);
    this.toString();
  }
  async toString() {
    this.text = this.content;
  }
};
var text_default = Text;

// src/reader/video.ts
var import_fluent_ffmpeg = __toESM(require("fluent-ffmpeg"));
var import_uuid3 = require("uuid");
var import_fs = __toESM(require("fs"));

// src/chatgpt/configuration.ts
var Configuration = class extends Base {
  constructor(options) {
    super(options);
    super.init(options);
  }
  update(options) {
    super.init(options);
    return this;
  }
};
var configuration_default = Configuration;

// src/utils/http/fetch.ts
var import_node_fetch = __toESM(require("node-fetch"));
function Fetch(url, init) {
  return (0, import_node_fetch.default)(url, init);
}

// src/chatgpt/service/openai-api.ts
var OpenaiApi = class extends Base {
  constructor(options) {
    super(options);
    this.api = "https://api.openai.com/v1/";
    this.model = "";
    this.configuration = new configuration_default({
      openkey: ""
    });
    this.configuration = options;
  }
  get headers() {
    return {
      Authorization: `Bearer ${this.configuration.openkey}`,
      "Content-Type": `application/json`
    };
  }
  fetch(url, options) {
    options.agent = options.agent || this.configuration.agent;
    options.signal = options.signal;
    return Fetch(url, options);
  }
  onPush(payload) {
    this.E.emit("push", payload);
    return this;
  }
  onError(payload) {
    this.E.emit("error", payload);
    return this;
  }
  onConnect(payload) {
    this.E.emit("connect", payload);
    return this;
  }
  onClose(payload) {
    this.E.emit("close", payload);
    return this;
  }
  onTimeout() {
    this.E.emit("timeout", "");
    return this;
  }
};
var openai_api_default = OpenaiApi;

// src/chatgpt/service/audio.ts
var import_form_data = __toESM(require("form-data"));
var Audio = class extends openai_api_default {
  constructor(configuration) {
    super(configuration);
    this.model = "whisper-1";
  }
  get headers() {
    return {
      Authorization: `Bearer ${this.configuration.openkey}`
      // 'Content-Type': `multipart/form-data`
    };
  }
  async transcriptions(options) {
    options.model = this.model || options.model;
    const formData = new import_form_data.default();
    Object.keys(options).map((key) => {
      let value = options[key];
      formData.append(key, value);
    });
    try {
      let response = await this.fetch(`${this.api}audio/transcriptions`, {
        method: "post",
        body: formData,
        headers: this.headers
      });
      if (response.status != 200)
        throw response;
      let body = await response.json();
      return {
        status: 200,
        data: body
      };
    } catch (error) {
      console.log(error, 46);
      return error;
    }
  }
};
var audio_default = Audio;

// src/utils/http/sse.ts
var import_eventsource_parser = require("eventsource-parser");

// src/utils/http/http.ts
var import_p_timeout = __toESM(require("p-timeout"));
var Http = class extends Base {
  constructor(url) {
    super();
    this.url = "";
    this.uid = "";
    this.__inEnd = false;
    this.__stage = "";
    this.proxy = null;
    this.headers = {
      "Content-Type": "application/json"
    };
    this.signal = null;
    this.body = {};
    this.timeoutMs = 15 * 1e3;
    this.options = {};
    this.__responseResolve = null;
    this.__responseHandle = async (res) => res.json();
    this.response = {};
    this.url = url;
  }
  setHid(id) {
    this.uid = id;
    return this;
  }
  setProxy(proxy) {
    this.proxy = proxy;
    return this;
  }
  setHeaders(headers) {
    this.headers = Object.assign(this.headers, headers);
    return this;
  }
  setSignal(signal) {
    this.signal = signal;
    return this;
  }
  setUrl(url) {
    this.url = url;
    return this;
  }
  setBody(body) {
    this.body = body;
    return this;
  }
  setOptions(options) {
    this.options = options;
    return this;
  }
  setTimeoutMs(timeoutMs) {
    this.timeoutMs = timeoutMs;
    return this;
  }
  setResponse(handle) {
    this.__responseHandle = handle;
  }
  setup() {
    this.__inEnd = false;
  }
  async run() {
    try {
      this.setup();
      let decorateFetch = (0, import_p_timeout.default)(
        Fetch(this.url, {
          method: "post",
          agent: this.proxy,
          headers: this.headers,
          ...this.options,
          body: this.options.body || this.body
        }),
        this.timeoutMs,
        () => {
          this.response.status = 503;
          this.response.code = 503;
          this.response.message = "TIMEOUT";
          try {
            this.onTimeout();
          } catch (error) {
          }
          throw this.response;
        }
      );
      const res = await decorateFetch;
      this.response = {
        message: res.statusText,
        status: res.status
      };
      this.__responseResolve && this.__responseResolve(res);
      if (res.status == 200) {
        let body = null;
        try {
          body = await this.__responseHandle(res);
        } catch (error) {
        } finally {
          this.onClose(body);
        }
      } else {
        this.response.type = "ERROR";
        this.onError(this.response);
      }
    } catch (error) {
      this.response = {
        type: "ERROR",
        status: error.code || 500,
        message: error.message || error.statusText
      };
      this.onError(this.response);
    } finally {
      return this.response;
    }
  }
  responseBody() {
    return new Promise((resolve) => {
      this.__responseResolve = resolve;
    });
  }
  onPush(payload, type) {
    if (this.__inEnd)
      return this;
    this.emit("push", payload, type);
    return this;
  }
  onError(payload, type) {
    if (this.__inEnd)
      return this;
    this.__inEnd = true;
    this.emit("error", payload, type);
    return this;
  }
  onConnect(payload, type) {
    this.emit("connect", payload, type);
    return this;
  }
  onClose(payload, type) {
    if (this.__inEnd)
      return this;
    this.__inEnd = true;
    this.emit("close", payload, type);
    return this;
  }
  onTimeout(payload, type = "TIMEOUT") {
    if (this.__inEnd)
      return this;
    this.__inEnd = true;
    this.emit("timeout", payload, type);
    return this;
  }
};
var http_default = Http;

// src/utils/http/sse.ts
var import_p_timeout2 = __toESM(require("p-timeout"));
var HttpEventSource = class extends http_default {
  constructor(url) {
    super(url);
    this.streamTimeoutMs = 4 * 1e3;
    this.streamTimer = null;
  }
  async run() {
    clearTimeout(this.streamTimer);
    this.streamTimer = null;
    super.setup();
    try {
      let decorateFetch = (0, import_p_timeout2.default)(
        Fetch(this.url, {
          method: "post",
          agent: this.proxy,
          headers: this.headers,
          ...this.options,
          body: this.options.body || this.body
        }),
        this.timeoutMs,
        () => {
          this.response.status = 503;
          this.response.code = 503;
          this.response.message = "TIMEOUT";
          try {
            this.onTimeout();
          } catch (error) {
          }
          throw this.response;
        }
      );
      const res = await decorateFetch;
      const parser = (0, import_eventsource_parser.createParser)((event) => {
        if (event.type == "event") {
          try {
            this.onPush(event.data);
          } catch (error) {
          }
        }
      });
      const Timeout = () => {
        this.streamTimer = setTimeout(() => {
          if (this.signal && this.signal.aborted) {
            this.resetStreamTimer();
            return;
          }
          this.onTimeout();
        }, this.streamTimeoutMs);
      };
      const feed = (chunk) => {
        clearTimeout(this.streamTimer);
        this.streamTimer = null;
        Timeout();
        parser.feed(chunk);
      };
      this.response = {
        message: res.statusText,
        status: res.status
      };
      this.__responseResolve && this.__responseResolve(res);
      if (res.status == 200) {
        let body = res.body;
        body.on("readable", () => {
          let chunk = body.read();
          while (chunk) {
            feed(chunk.toString());
            chunk = body.read();
          }
        });
        this.onConnect(res);
      } else {
        this.response.type = "ERROR";
        this.onError(this.response);
      }
    } catch (error) {
      this.resetStreamTimer();
      this.response = {
        type: "ERROR",
        status: error.code || 500,
        message: error.message || error.statusText
      };
      this.onError(this.response);
    }
    return this.response;
  }
  resetStreamTimer() {
    clearTimeout(this.streamTimer);
    this.streamTimer = null;
  }
  onClose(payload, type) {
    this.resetStreamTimer();
    super.onClose(payload, type);
    return this;
  }
  onError(payload, type) {
    this.resetStreamTimer();
    super.onError(payload, type);
    return this;
  }
  onConnect(payload, type) {
    this.resetStreamTimer();
    super.onConnect(payload, type);
    return this;
  }
  onTimeout(payload, type) {
    super.onTimeout(payload, type);
    return this;
  }
};
var sse_default = HttpEventSource;

// src/chatgpt/http/openai-sse.ts
var OpenaiHttpEventSource = class extends sse_default {
  constructor(url) {
    super(url);
  }
  onPush(payload) {
    let response = null;
    try {
      if (payload === "[DONE]") {
        super.onClose(response);
        return;
      }
      response = JSON.parse(payload);
      super.onPush(response);
    } catch (error) {
    } finally {
      return this;
    }
  }
};
var openai_sse_default = OpenaiHttpEventSource;

// src/chatgpt/http/chatgpt-sse.ts
var ChatgptHttpEventSource = class extends sse_default {
  constructor(url) {
    super(url);
  }
  onPush(payload) {
    var _a, _b;
    let response = null;
    try {
      if (payload === "[DONE]") {
        super.onClose(response);
        return;
      }
      response = JSON.parse(payload || "{}");
      response.choices = [{ delta: { content: (_b = (_a = response.message) == null ? void 0 : _a.content) == null ? void 0 : _b.parts[0] } }];
      super.onPush(response);
    } catch (error) {
    } finally {
      return this;
    }
  }
};
var chatgpt_sse_default = ChatgptHttpEventSource;

// src/chatgpt/service/chat-completions.ts
var ChatCompletions = class extends openai_api_default {
  constructor(configuration) {
    super(configuration);
    this.model = "gpt-3.5-turbo";
  }
  talk(options, fetchOptions = {}) {
    options.model = this.model || options.model;
    let HttpController = options.stream ? openai_sse_default : http_default;
    let sse = new HttpController(`${this.api}chat/completions`);
    sse.setHeaders(this.headers);
    sse.setProxy(this.configuration.agent);
    sse.setSignal(fetchOptions == null ? void 0 : fetchOptions.signal);
    sse.setBody(JSON.stringify(options));
    sse.setOptions(fetchOptions);
    sse.setTimeoutMs(200 * 1e3);
    return sse;
  }
};
var chat_completions_default = ChatCompletions;

// src/chatgpt/service/embedding.ts
var Embedding = class extends openai_api_default {
  constructor(configuration) {
    super(configuration);
    this.model = "text-embedding-ada-002";
  }
  async create(options) {
    options.model = this.model || options.model;
    try {
      let response = await this.fetch(`${this.api}embeddings`, {
        method: "post",
        body: JSON.stringify(options),
        headers: this.headers
      });
      if (response.status != 200)
        throw response;
      let body = await response.json();
      return {
        status: response.status,
        data: body
      };
    } catch (error) {
      return error;
    }
  }
};
var embedding_default = Embedding;

// src/chatgpt/service/chatgpt-chat.ts
var import_uuid2 = require("uuid");
var ChatgptChat = class extends openai_api_default {
  constructor(configuration) {
    super(configuration);
    this.model = "text-davinci-002-render-sha";
    this.api = "https://ai.fakeopen.com/";
  }
  get headers() {
    return {
      Authorization: `Bearer ${this.configuration.accessToken}`,
      "Content-Type": `application/json`
    };
  }
  talk(options, fetchOptions = {}) {
    let stream = options.stream;
    if (stream === false) {
      stream = false;
    }
    let body = {
      "stream": stream || false,
      "action": "next",
      "conversation_id": options.conversation_id || void 0,
      "messages": options.messages.map((message) => {
        return {
          "id": message.message_id || (0, import_uuid2.v4)(),
          "role": message.role,
          "author": {
            "role": message.role
          },
          "content": {
            "content_type": "text",
            "parts": [
              message.content
            ]
          }
        };
      }),
      "model": this.model,
      "parent_message_id": options.parent_message_id || (0, import_uuid2.v4)()
    };
    options.model = this.model || options.model;
    let HttpController = options.stream ? chatgpt_sse_default : http_default;
    let sse = new HttpController(`${this.api}api/conversation`);
    if (!options.stream) {
      sse.setResponse(async (res) => {
        var _a, _b;
        let text = await res.text();
        let answer = text.replace(/data\: \[DONE\]/g, " ").split("data: ").slice(-1)[0];
        let r = JSON.parse(answer);
        r.choices = [{ delta: { content: (_b = (_a = r.message) == null ? void 0 : _a.content) == null ? void 0 : _b.parts[0] } }];
        return r;
      });
      sse.setTimeoutMs(200 * 1e3);
    }
    sse.setHeaders(this.headers);
    sse.setProxy(this.configuration.agent);
    sse.setSignal(fetchOptions == null ? void 0 : fetchOptions.signal);
    sse.setBody(JSON.stringify(body));
    sse.setOptions(fetchOptions);
    return sse;
  }
};
var chatgpt_chat_default = ChatgptChat;

// src/chatgpt/index.ts
var modules = [audio_default, chat_completions_default, embedding_default, chatgpt_chat_default];
var Openai = class extends Base {
  constructor(configuration) {
    let _config = new configuration_default(configuration);
    super(_config);
    modules.map((module2) => {
      this[module2.name] = new module2(_config);
    });
  }
};
var chatgpt_default = Openai;

// src/reader/video.ts
var Video = class extends reader_default {
  constructor(options) {
    super(options);
    this.type = "video";
    this.openkey = "";
    this.openai = null;
    if (!options.openai) {
      this.openai = new chatgpt_default({
        agent: options.agent,
        openkey: options.openkey
      });
    }
    super.init(options);
  }
  async toString() {
    return new Promise((resolve, reject) => {
      let tmpFile = `${__dirname}/.tmp/${(0, import_uuid3.v4)()}.mp3`;
      (0, import_fluent_ffmpeg.default)(this.file).noVideo().on("end", async () => {
        try {
          let response = await this.openai.Audio.transcriptions({
            file: import_fs.default.createReadStream(tmpFile)
          });
          this.text = response.data.text;
          console.log(this.text);
          resolve(response.data.text);
        } catch (error) {
          reject("");
        } finally {
          import_fs.default.unlinkSync(tmpFile);
        }
      }).output(tmpFile).run();
    });
  }
};
var video_default = Video;

// src/reader/index.ts
var import_keyv = __toESM(require("keyv"));
var import_uuid4 = require("uuid");
var Seed = class extends Base {
  constructor(options) {
    super(options);
    this.plugins = {
      Text: text_default,
      Video: video_default
    };
    this.limited = 1e3;
    this.maxLimited = 1e3;
    this.contextPoint = 200;
    this.packs = [];
    this.chunks = [];
    this.store = new import_keyv.default({ store: /* @__PURE__ */ new Map() });
    this.Openai = null;
    this.readend = false;
    let min = Math.min(this.maxLimited, options.limited || this.limited);
    options.limited = min;
    super.init(options);
    this.Openai = new chatgpt_default({
      openkey: options.openkey,
      agent: options.agent
    });
  }
  feed(data) {
    this.readend = false;
    this.packs.push(...data);
    return this;
  }
  async chunked() {
    let { limited, contextPoint } = this;
    let chunks = [];
    let seed = this;
    let chunksPromise = this.packs.map((pack) => {
      async function chunkify() {
        let aloneChunks = [];
        await pack.toString();
        if (pack.text.length <= limited) {
          chunks.push(pack.text);
        } else {
          aloneChunks = seed.Cut(pack.text, limited, contextPoint);
          chunks.push(...aloneChunks);
        }
      }
      return chunkify();
    });
    await Promise.all(chunksPromise);
    this.chunks = chunks;
    return this;
  }
  async summarize() {
    console.log("\u542F\u52A8\u9605\u8BFB: bi\uFF5Ebi\uFF5Ebi\uFF5E");
    if (this.readend) {
      console.log("\u9605\u8BFB\u5B8C\u6210: bi\uFF5Ebi\uFF5Ebi\uFF5E");
      return;
    }
    let openai = this.Openai;
    let l = this.chunks.length;
    if (l <= 1) {
      let uuid = (0, import_uuid4.v4)();
      this.store.set(uuid, {
        question: "",
        answer: this.chunks[0],
        embed: [],
        uuid
      });
      console.log("\u9605\u8BFB\u5B8C\u6210: bi\uFF5Ebi\uFF5Ebi\uFF5E");
      this.readend = true;
      return;
    }
    let num = 0;
    let embeds = [];
    embeds = await Promise.all(this.chunks.map((text) => {
      return new Promise(async (resolve) => {
        let server = openai.ChatCompletions.talk({
          messages: [
            {
              role: "user",
              content: `\u6839\u636E\u4E0B\u9762\u7ED9\u51FA\u7684\u5185\u5BB9\uFF0C\u63D0\u53D6\u6210\u5173\u952E\u8BCD\u95EE\u9898: ${text}`
            }
          ]
        });
        await server.run();
        let content = server.response.data.choices[0].message.content;
        let response = await openai.Embedding.create({
          input: content
        });
        let embed = response.data.data[0].embedding;
        console.log(`\u95EE\u9898\u5DF2\u751F\u6210: ${content} `);
        console.log(`\u9605\u8BFB\u5B8C\u6210\u2705\u5EA6: ${(num + 1) / l * 100}%`);
        num++;
        return resolve({
          embed,
          question: content,
          answer: text,
          uuid: (0, import_uuid4.v4)()
        });
      });
    }));
    this.readend = true;
    embeds.map((_) => {
      this.store.set(_.uuid, _);
    });
  }
  cosineSimilarity(embedA, embedB) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < embedA.length; i++) {
      dot += embedA[i] * embedB[i];
      normA += embedA[i] * embedA[i];
      normB += embedB[i] * embedB[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    return dot / (normA * normB);
  }
  max(arr) {
    const maxIndex = arr.reduce((maxIndex2, currentValue, currentIndex, array) => {
      if (currentValue > array[maxIndex2]) {
        return currentIndex;
      } else {
        return maxIndex2;
      }
    }, 0);
    return maxIndex;
  }
  async question(options = {}) {
    let response = await this.Openai.Embedding.create({
      input: options.input
    });
    let emb = response.data.data[0].embedding;
    let simFragment = null;
    for await (const [key, value] of this.store.iterator()) {
      let sim = this.cosineSimilarity(emb, value.embed);
      if (!simFragment || sim > simFragment.sim) {
        value.sim = sim;
        simFragment = value;
      }
    }
    ;
    let serve = this.Openai.ChatCompletions.talk({
      messages: [
        {
          role: "assistant",
          content: `\u6839\u636E\u4E0B\u9762\u7ED9\u51FA\u7684\u63CF\u8FF0\uFF0C\u4ECE\u4E2D\u83B7\u53D6\u7B54\u6848\uFF0C\u5E76\u4E14\u626E\u6F14\u63CF\u8FF0\u5185\u5BB9\u7684ai\u52A9\u624B\uFF0C\u5982\u679C\u4F60\u7684\u7B54\u6848\u548C\u4E0B\u9762\u63CF\u8FF0\u65E0\u5173\u53EA\u9700\u8981\u56DE\u590D'No'\u4E0D\u9700\u8981\u56DE\u590D\u5176\u4F59\u5185\u5BB9`
        },
        {
          role: "assistant",
          content: options.desc || ""
        },
        {
          role: "user",
          content: simFragment.answer
        },
        {
          role: "user",
          content: options.input
        }
      ]
    });
    await serve.run();
    return serve.response.data.choices[0].message.content;
  }
  /**
   * 
   * 切割字符串
   * 
   * @param text 
   * @param limited 
   * @param contextPoint 
   * @returns 
   */
  Cut(text, limited, contextPoint) {
    let str = "";
    let chunks = [];
    let strNum = 0;
    let cacheLastContextPointStr = "";
    for (let value of text) {
      str = str + value;
      strNum++;
      if (strNum >= limited - contextPoint + 1) {
        cacheLastContextPointStr = cacheLastContextPointStr + value;
      }
      ;
      if (strNum === limited) {
        chunks.push(str);
        str = cacheLastContextPointStr;
        cacheLastContextPointStr = "";
        strNum = contextPoint;
      }
    }
    ;
    if (str && str.length < limited && str.length > contextPoint) {
      chunks.push(str);
    }
    ;
    return chunks;
  }
};
var reader_default2 = Seed;

// src/midjourney/configuration.ts
var Configuration2 = class extends Base {
  constructor(options) {
    super(options);
    super.init(options);
  }
  update(options) {
    super.init(options);
    return this;
  }
};
var configuration_default2 = Configuration2;

// src/midjourney/service/midjourney-api.ts
var import_node_fetch2 = __toESM(require("node-fetch"));
var MidjourneyApi = class extends Base {
  constructor(options) {
    super(options);
    this.api = "https://discord.com/api/v9/";
    this.model = "";
    this.configuration = new configuration_default2({
      SERVER_ID: "",
      SALAI_TOKEN: "",
      CHANNEL_ID: ""
    });
    this.configuration = options;
  }
  get headers() {
    return {
      authorization: `${this.configuration.SALAI_TOKEN}`,
      "Content-Type": `application/json`
    };
  }
  fetch(url, options) {
    options.agent = options.agent || this.configuration.agent;
    options.signal = options.signal;
    return (0, import_node_fetch2.default)(url, options);
  }
  generateNumericNonce(length = 19) {
    const characters = "0123456789";
    let nonce = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      nonce += characters.charAt(randomIndex);
    }
    return nonce;
  }
  onPush(payload) {
    this.E.emit("push", payload);
    return this;
  }
  onError(payload) {
    this.E.emit("error", payload);
    return this;
  }
  onConnect(payload) {
    this.E.emit("connect", payload);
    return this;
  }
  onClose(payload) {
    this.E.emit("close", payload);
    return this;
  }
  onTimeout() {
    this.E.emit("timeout", "");
    return this;
  }
};
var midjourney_api_default = MidjourneyApi;

// src/midjourney/service/channels.ts
var import_fs2 = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_mime = __toESM(require("mime"));
var Channels = class extends midjourney_api_default {
  constructor(configuration) {
    super(configuration);
  }
  async attachments(options) {
    let filePath = options.filePath;
    let file = import_fs2.default.readFileSync(filePath);
    let file_size = file.length;
    let filename = import_path.default.basename(filePath);
    let mimeType = import_mime.default.getType(filePath);
    filename = `${options.id || this.generateNumericNonce()}_${filename}`;
    console.log();
    try {
      let AttachmentResponse = await this.fetch(`${this.api}/channels/${this.configuration.CHANNEL_ID}/attachments`, {
        method: "post",
        headers: this.headers,
        body: JSON.stringify({ "files": [{ "filename": filename, "file_size": file_size, "id": options.attachments_id || "0" }] })
      });
      if (AttachmentResponse.status != 200)
        throw AttachmentResponse;
      let AttachmentResponseJson = await AttachmentResponse.json();
      let { id, upload_url, upload_filename } = AttachmentResponseJson.attachments[0];
      await this.fetch(`${upload_url}`, {
        method: "put",
        body: file,
        headers: {
          "content-type": mimeType
        }
      });
      return {
        status: 200,
        body: {
          filename,
          uploaded_filename: upload_filename,
          id
        }
      };
    } catch (error) {
      return error;
    }
  }
  async sendMessage(options) {
    try {
      let bodyOptions = Object.assign({
        "channel_id": "" + this.configuration.CHANNEL_ID,
        "nonce": this.generateNumericNonce(),
        "type": 0,
        "sticker_ids": [],
        "attachments": []
      }, options);
      let response = await this.fetch(`${this.api}/channels/${this.configuration.CHANNEL_ID}/messages`, {
        method: "post",
        headers: this.headers,
        body: JSON.stringify(bodyOptions)
      });
      if (response.status != 200)
        throw response;
      let body = await response.json();
      return {
        body,
        status: 200
      };
    } catch (error) {
      return error;
    }
  }
};
var channels_default = Channels;

// src/midjourney/service/interactions.ts
var Interactions = class extends midjourney_api_default {
  constructor(configuration) {
    super(configuration);
  }
  async describe(options) {
    try {
      let channels = new channels_default(this.configuration);
      let response = await channels.attachments(options);
      response.body.id = options.id;
      let c_id = "1092492867185950852";
      let reqid = this.generateNumericNonce();
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
      };
      let res = await this.fetch(`${this.api}interactions`, {
        method: "post",
        body: JSON.stringify(payload_json),
        headers: this.headers
      });
      let body = res.body;
      body.on("readable", () => {
        let chunk = body.read();
        while (chunk) {
          console.log(chunk.toString());
          chunk = body.read();
        }
      });
      if (res.status === 200 || res.status === 204) {
        return {
          status: res.status
        };
      }
      throw res;
    } catch (error) {
      return error;
    }
  }
};
var interactions_default = Interactions;

// src/midjourney/index.ts
var modules2 = [channels_default, interactions_default];
var Midjourney = class extends Base {
  constructor(configuration) {
    let _config = new configuration_default2(configuration);
    super(_config);
    modules2.map((module2) => {
      this[module2.name] = new module2(_config);
    });
  }
};
var midjourney_default = Midjourney;

// src/queue/center.ts
var Center = class extends Base {
  constructor() {
    super();
    this.counters = [];
  }
  getFastCounter(options) {
    let fastCounter = null;
    this.counters.map((counter) => {
      if (options && options.cuid && options.cuid !== counter.cuid) {
        return void 0;
      }
      if (!fastCounter)
        fastCounter = counter;
      if (counter.length < fastCounter.length) {
        fastCounter = counter;
      }
    });
    return fastCounter;
  }
  add(counter) {
    this.counters.push(counter);
    return this;
  }
};
var center_default = Center;

// src/queue/counter.ts
var Counter = class extends Base {
  constructor(options = {}) {
    super();
    this.name = "";
    this.cuid = "";
    this.mans = [];
    this.info = {};
    super.init(options);
  }
  get length() {
    let runManNum = this.runMan ? 1 : 0;
    return this.mans.length + runManNum;
  }
  sub(man) {
    man.__counter = this;
    this.mans.push(man);
    if (this.runMan && this.runMan.receptioning) {
      this.notice();
      return;
    }
    ;
    this.next();
  }
  unsub(man) {
    let index = this.mans.findIndex((m) => man === m);
    man.__counter = null;
    if (man === this.runMan) {
      this.next();
    } else {
      this.mans.splice(index, 1);
    }
  }
  next() {
    if (this.runMan) {
      this.runMan.doEnd();
    }
    this.runMan = this.mans.shift();
    if (this.runMan) {
      this.runMan.do(this);
      this.notice();
    }
  }
  notice() {
    this.mans.map((man, i) => {
      !man.receptioning && man.onMessage(this, {
        length: this.mans.length,
        wait: i
      });
    });
  }
};
var counter_default = Counter;

// src/queue/man.ts
var Man = class extends Base {
  constructor(options = {}) {
    super();
    this.receptioning = false;
    super.init(options);
  }
  onServe(__serve) {
    this.__serve = __serve;
  }
  serve(next) {
    this.__serve && this.__serve(next);
  }
  // 执行任务
  async do(counter) {
    counter = this.__counter || counter;
    this.receptioning = true;
    let next = () => {
      if (next.void)
        return;
      counter.next.call(counter);
      next.void = true;
    };
    next.void = false;
    this.__next = next;
    this.serve(next);
  }
  next() {
    this.__next && this.__next();
  }
  doEnd() {
    this.receptioning = false;
  }
  onMessage(counter, info) {
  }
  // 离开当前队列或者结束当前服务
  leave(counter) {
    this.receptioning = false;
    (this.__counter || counter).unsub(this);
  }
};
var man_default = Man;

// src/queue/index.ts
var queue_default = { Counter: counter_default, Center: center_default, Man: man_default };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Midjourney,
  OpenAi,
  Queue,
  Reader
});
//# sourceMappingURL=index.js.map