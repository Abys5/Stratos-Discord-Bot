import {Client, Guild, MessageEmbed} from "discord.js";

import Config from './config.json';
import moment from "moment";
import activityHandler from "./handlers/activityHandler";

const DiscordClient = new Client();

const StartTime = Date.now();

DiscordClient.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(Config.default_prefix)) return;

    const [commandname, ...args] = message.content.substring(Config.default_prefix.length).split(" ");

    if (commandname == "status") {
        try {
            const embed = new MessageEmbed();
            embed.setTitle("❗ Status Check ❗")
                .setColor(0x00ff00)
                .addField(`**Message Latency**`, `${Date.now() - message.createdTimestamp}ms`)
                .addField("**Uptime**", moment(DiscordClient.uptime).subtract(1, "h").format("h[H] m[M] s[S]"))
                .addField("**Guild Count**", DiscordClient.guilds.cache.size);

            let memberCount = 0;
            DiscordClient.guilds.cache.forEach((guild) => {
                memberCount += guild.memberCount;
            });

            embed.addField("**Member Count**", memberCount);

            await message.channel.send(embed);
        } catch (e) {
            await message.channel.send("Error Occurred: "+ e)
            throw e;
        }

    }
    
})

DiscordClient.on("ready", () => {
    console.log("[ACTION: READY] Discord Bot is Ready");
    activityHandler();

})

DiscordClient.login(Config.token).then(r => {
    console.log("[ACTION: LOGIN] Logged In");
});

export default DiscordClient;