import {Message} from "discord.js";

export default interface ICommand {
    guildOnly: boolean;
    desc: string;
    execute: (args: string[], message: Message) => boolean;
}