import {commandMap} from "../handlers/commandHandler";
import {Message, MessageEmbed} from "discord.js";
import Command from "../classes/command";

class helpCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({reason: "Stratos Auto Delete"})
        const embed = new MessageEmbed();

        embed.setTitle("Help").setColor(0x00ff00);
        commandMap.forEach((command, commandname) => {
            embed.addField(command.commandName, command.desc);
        })
        message.author.send(embed);
        if (message.guild) {
            message.channel.send("Check DM's").then((messageSent) => {
                messageSent.delete({timeout: 2000, reason: "Auto Delete"});
                message.delete({reason: "Auto Delete"});
            })
        }
        return true;
    }
}

commandMap.push(new helpCMD("help",
    false,
    "Help Command",
    [
    ]));


//commandMap.set("help", commandInfo);
