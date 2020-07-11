import ICommand from "../interface/ICommand";
import {commandMap} from "../handlers/commandHandler";
import {MessageEmbed} from "discord.js";
import moment from "moment";
import DiscordClient from "../index";
import {activities} from "../handlers/activityHandler";


const commandInfo: ICommand = {desc: "Shows the Bots Status", execute: (args, message) => {
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

            embed.addField("**Command Count**", commandMap.size);

            embed.addField("**Activity Status Count**", activities.length);

            message.channel.send(embed);
        } catch (e) {
            message.channel.send("Error Occurred: "+ e)
            throw e;
        }
    return true;
}}

commandMap.set("status", commandInfo);