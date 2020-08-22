import Command from "../../classes/command";
import {Message} from "discord.js";
import {serverQueues} from "../../handlers/musicHandler";

class StopCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({timeout: 2000, reason: "Stratos Auto Delete"})
        if (message.guild) {
            if (message.guild.voice) {
                var server = serverQueues[message.guild.id];
                for (var i = server.queue.length - 1; i>=0; i--) {
                    server.queue.splice(i, 1)
                }
                if (server.dispatcher) server.dispatcher.end();
            }
        }
        return true;
    }
}

export default new StopCMD("stop",
    true,
    "**stop** - Stops the Music",
    []);
