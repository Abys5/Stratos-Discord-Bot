import {commandMap} from "../handlers/commandHandler";
import {Message, MessageEmbed} from "discord.js";
import DiscordClient from "../index";
import {activities} from "../handlers/activityHandler";
import Command from "../classes/command";

class statusCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({reason: "Stratos Auto Delete"})
        if (DiscordClient.uptime == null) {
            message.channel.send("Error Occurred: No Uptime")
            return true;
        }

        let totalSeconds = (DiscordClient.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);

        const embed = new MessageEmbed();
        embed.setTitle("❗ Status Check ❗")
            .setColor(0x00ff00)
            .addField(`**Message Latency**`, `${Date.now() - message.createdTimestamp}ms`)
            .addField("**Uptime**", `${days} Days ${hours}H ${minutes}M`)
            .addField("**Guild Count**", DiscordClient.guilds.cache.size);

        let memberCount = 0;
        DiscordClient.guilds.cache.forEach((guild) => {
            memberCount += guild.memberCount;
        });
        embed.addField("**Member Count**", memberCount);

        embed.addField("**Command Count**", commandMap.length);

        embed.addField("**Activity Status Count**", activities.length);

        message.channel.send(embed);
        return true;
    }
}

commandMap.push(new statusCMD("status",
    true,
    "View Bot Status",
    [
    ]));

