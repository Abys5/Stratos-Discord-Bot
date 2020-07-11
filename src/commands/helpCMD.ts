import ICommand from "../interface/ICommand";
import {commandMap} from "../handlers/commandHandler";
import {MessageEmbed} from "discord.js";

const commandInfo: ICommand = {desc: "Shows all commands", execute: (args, message) => {
        const embed = new MessageEmbed();

        embed.setTitle("Help").setColor(0x00ff00);
        commandMap.forEach((command, commandname) => {
            embed.addField(commandname, command.desc);
        })
        message.author.send(embed);
        if (message.guild) {
            message.channel.send("Check DM's").then((messageSent) => {
                messageSent.delete({timeout: 2000, reason: "Auto Delete"});
                message.delete({reason: "Auto Delete"});
            })
        }
        return true;
    }}

commandMap.set("help", commandInfo);