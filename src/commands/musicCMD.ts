import {commandMap} from "../handlers/commandHandler";
import {
    Message, MessageEmbed,
} from "discord.js";
import Command from "../classes/command";
import musicPlay from "./music/musicPlay";
import musicSkip from "./music/musicSkip";
import musicQueue from "./music/musicQueue";
import musicStop from "./music/musicStop";
import musicNow from "./music/musicNow";



class MusicCMD extends Command {
    execute(message: Message, args: string[]): boolean {
        if(super.execute(message, args)) {
            return true;
        };
        message.delete({reason: "Stratos Auto Delete"})

        const embed = new MessageEmbed();

        embed.setTitle("Music Help").setColor(0x00ff00);
        this.subCommandList.forEach(command => {
            embed.addField("\u200B", command.desc);
        });

        message.channel.send(embed).then(r => {
            r.delete({timeout: 5000, reason: "Stratos Auto Delete"});
        });
        return true;
    }
}

commandMap.push(new MusicCMD("music", //s!music
    true,
    "Plays Music From YT",
    [
        musicPlay,
        musicSkip,
        musicQueue,
        musicStop,
        musicNow
    ]));
