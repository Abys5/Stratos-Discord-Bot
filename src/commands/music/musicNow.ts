import Command from "../../classes/command";
import {Message, TextChannel} from "discord.js";
import {serverQueues} from "../../handlers/musicHandler";
import nowPlayingMSG from "../../message/nowPlayingMSG";
import errorMSG from "../../message/errorMSG";

class NowCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({timeout: 2000, reason: "Stratos Auto Delete"})
        if (message.guild) {
            if (message.guild.voice) {
                const server = serverQueues[message.guild.id];
                let song = server.queue[0];
                if (song) {
                    nowPlayingMSG(song.name, song.url, song.thumbnail, <TextChannel>message.channel);
                    return true;
                } else {
                    errorMSG("No Song is Playing", "", message);
                    return true;
                }

            }
        }
        return true;
    }
}

export default new NowCMD("now",
    true,
    "**now** - Get Current Song Playing",
    Permissions["music.now"],
    []);
