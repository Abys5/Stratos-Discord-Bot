import ICommand from "../interface/ICommand";
import {Message} from "discord.js";

const commandMap = new Map<String, ICommand>();

const commandHandler = (commandName: string, args: string[], message: Message) => {
    const command = commandMap.get(commandName);
    if (command == undefined) return;

    console.log(`[ACTION: CMD] ${message.author.username+"#"+message.author.discriminator} ran ${commandName} in ${message.channel} on ${message.guild?.name}`);
    command.execute(args, message);

}

export { commandMap, commandHandler };