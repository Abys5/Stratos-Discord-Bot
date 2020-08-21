import {Message} from "discord.js";
import Command from "../classes/command";
import errorMSG from "../message/errorMSG";

const commandMap: Command[] = [];

const commandHandler = (commandName: string, args: string[], message: Message) => {
    const command = commandMap.filter((item) => item.commandName === commandName)[0];
    if (command == undefined) return;
    if (command.guildOnly == true && !message.guild) {
        errorMSG("This is not in a Guild", "", message);
        return;
    }
    console.log(`[ACTION: CMD] ${message.author.username+"#"+message.author.discriminator} ran ${commandName} in ${message.channel} on ${message.guild?.name}`);
    command.execute(message, args);

}

export { commandMap, commandHandler };
