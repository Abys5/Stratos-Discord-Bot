import Command from "../../classes/command";
import {Message} from "discord.js";
import {commandMap} from "../../handlers/commandHandler";

class PlayCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        //message.channel.send("OwO")
        return true;
    }
}

export default new PlayCMD("play",
    true,
    "**play <song|url>** - Play Song on YT",
    []);
