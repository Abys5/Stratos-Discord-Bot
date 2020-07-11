import {Message} from "discord.js";

export default interface ICommand {
    desc: string;
    execute: (args: string[], message: Message) => boolean;
}