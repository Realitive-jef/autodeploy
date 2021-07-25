const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();

// Youtube投稿通知

const debugChannelId = "817238014282563655";
const mainChannelId = "817238014282563655";

http
  .createServer(function(req, res) {
    if (req.method == "POST") {
      let data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        if (dataObject.type == "newEruruVideo") {
          let msgChannelId = debugChannelId;
          if (dataObject.debug !== undefined && dataObject.debug == "false") {
            msgChannelId = mainChannelId;
          }
          let msgMention = "<@&817227885470416927>";
          let videoId = dataObject.url.replace("https://youtu.be/", "");
          let emb = {
            embed: {
              author: {
                name: "Sharoro/しゃろろぉ",
                url:
                  "https://www.youtube.com/c/Eruru%E3%81%88%E3%82%8B%E3%82%8B%E3%81%85/featured",
                icon_url:
                  "https://yt3.ggpht.com/ytc/AKedOLRV6FUtQ_XIT9hNroje1k1mkf6kNOyqODSQw3P-HQ=s88-c-k-c0x00ffffff-no-rj"
              },
              title: dataObject.title,
              url: dataObject.url,
              description: dataObject.description,
              color: 7506394,
              timestamp: new Date(),
              thumbnail: {
                url: "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg"
              }
            }
          };
          client.channels.cache.get(msgChannelId).send(の新着動画モコ！", emb);
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord bot is active now \n");
    }
  })
  .listen(3000);

// ランダム

client.on("ready", message => {
  console.log("Bot is Ready!");
  client.user.setPresence({ activity: { name: "モココ二シテヤルノ" } });
});

client
  .on("ready", () => console.log("ready"))
  .on("message", message => {
    if (message.author.bot) {
      return;
    }
    if (message.mentions.users.find(user => user.id === client.user.id)) {
      if (message.content.match(/ガチャ/)) {
        const result = Math.floor(Math.random() * 20 + 1) * 10;
        if (result < 200) {
          message.reply(`う～ん。。。${result}連！`);
        }
      } else message.reply(`は～い`);
    }
  });

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("DISCORD_BOT_TOKEN　undefined");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
