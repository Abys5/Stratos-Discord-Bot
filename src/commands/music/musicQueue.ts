import Command from "../../classes/command";
import {Message, MessageEmbed} from "discord.js";
import {serverQueues} from "../../handlers/musicHandler";
import errorMSG from "../../message/errorMSG";

class queueCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({timeout: 2000, reason: "Stratos Auto Delete"})
        if (message.guild) {
            var server = serverQueues[message.guild.id];
            if (!server) {
                errorMSG("No Server Queue Initialized", "Contact the developer if this continues", message);
                return true;
            }
            const embed = new MessageEmbed();
            embed.setTitle("Music Queue");
            for (let i = 0; i < 5; i++) {
                if (!server.queue[i])
                    continue;

                embed.addField(i+1, server.queue[i].name);
            }

            if (server.queue.length === 0) {
                embed.setDescription("Use 's!music play <song|url>' to add a song to queue.")
            }


            message.channel.send(embed).then(r => {
                r.delete({timeout: 5000, reason: "Stratos Auto Delete"});
            });
            return true;
        } else {
            errorMSG("Not in Guild", "", message);
        }

        return true;
    }
}

export default new queueCMD("queue",
    true,
    "**queue** - Displays Queue List",
    []);
