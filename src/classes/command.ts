import {Message} from "discord.js";

class Command {

    commandName: string;
    desc: string;
    permissionNode: Permissions;
    subCommandList: Command[];
    guildOnly: boolean;
    hidden: boolean;

    constructor(name: string, guildOnly: boolean, desc: string, permissionNode: Permissions, subcmds: Command[], hidden: boolean = false) {
        this.commandName = name
        this.subCommandList = subcmds;
        this.guildOnly = guildOnly;
        this.desc = desc;
        this.permissionNode = permissionNode;
        this.hidden = hidden;
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
