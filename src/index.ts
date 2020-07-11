import {Client, Guild, MessageEmbed} from "discord.js";

import Config from './config.json';
import moment from "moment";
import activityHandler from "./handlers/activityHandler";
import {commandHandler} from "./handlers/commandHandler";
import {readdirSync} from "fs";

const DiscordClient = new Client();

const StartTime = Date.now();

DiscordClient.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(Config.default_prefix)) return;

    const [commandname, ...args] = message.content.substring(Config.default_prefix.length).split(" ");

    commandHandler(commandname, args, message);
})

DiscordClient.on("ready", () => {
    console.log("[ACTION: READY] Discord Bot is Ready");
    activityHandler();
    readdirSync(__dirname+"/commands").forEach(async (filename) => {
        await import(`./commands/${filename.replace(".ts", "")}`);
        console.log(`[ACTION: CMD Loaded] ${filename}`);
    });
})

DiscordClient.login(Config.token).then(r => {
    console.log("[ACTION: LOGIN] Logged In");
});

export default DiscordClient;