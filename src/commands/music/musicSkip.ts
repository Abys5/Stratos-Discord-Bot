import Command from "../../classes/command";
import {Message} from "discord.js";
import {serverQueues} from "../../handlers/musicHandler";

class SkipCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({timeout: 2000, reason: "Stratos Auto Delete"})
        if (message.guild) {
            var server = serverQueues[message.guild.id];
            //server.queue.shift();
            if (server.dispatcher) server.dispatcher.end();
        }
        return true;
    }
}

export default new SkipCMD("skip",
    true,
    "**skip** - Skips Current Song",
    []);
