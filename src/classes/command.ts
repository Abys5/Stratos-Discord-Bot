import {Message} from "discord.js";
import errorMSG from "../message/errorMSG";

class Command {

    commandName: string;
    desc: string;
    subCommandList: Command[];
    guildOnly: boolean;

    constructor(name: string, guildOnly: boolean, desc: string, subcmds: Command[]) {
        this.commandName = name
        this.subCommandList = subcmds;
        this.guildOnly = guildOnly;
        this.desc = desc;
    }

    execute(message: Message, args: string[]): boolean {
        const subcommand = this.subCommandList.filter((item) => item.commandName === args[0])[0];
        if (subcommand != null) {
            const modArgs = args.splice(1);
            subcommand.execute(message, modArgs);
            return true;
        }
        return false;
    }

}

export default Command;
