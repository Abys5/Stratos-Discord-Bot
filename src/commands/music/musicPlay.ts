import Command from "../../classes/command";
import {GuildMemberResolvable, Message, TextChannel} from "discord.js";
import errorMSG from "../../message/errorMSG";
import {addQueue, playYT, serverQueues} from "../../handlers/musicHandler";

class PlayCMD extends Command {
    execute(message: Message, args: string[]) {
        super.execute(message, args);
        message.delete({timeout: 2000, reason: "Stratos Auto Delete"})
        if (!args[1]) {
            message.channel.send("No Song Provided").then(r => {
                r.delete({timeout: 2000, reason: "Stratos Auto Delete"})
            })
            return true;
        }

        if (message.guild) {
            const permissions = message.member?.voice.channel?.permissionsFor(<GuildMemberResolvable>message.guild.me);

            if (!permissions?.has("CONNECT")) {
                errorMSG("Unable to connect in this voice channel", "Permission Denied", message);
                return true;
            }

            if (!permissions?.has("SPEAK")) {
                errorMSG("Unable to speak in this voice channel", "Permission Denied", message);
            }

            if (!message.member?.voice.channel) {
                errorMSG("Unable to play as user is not in a voice channel", "", message);
                return true;
            }

            if (!(message.channel instanceof TextChannel)) {
                errorMSG("You somehow sent a text message in a voice channel", "", message);
                return true;
            }


            addQueue(args.splice(1).join(" "), message.guild.id, message.channel).then(() => {
                if (message.guild == null) {
                    errorMSG("This is not in a Guild", "", message);
                    return true;
                }

                if (!message.member?.voice.channel) {
                    errorMSG("Unable to play as user is not in a voice channel", "", message);
                    return true;
                }

                if (!message.guild.voice?.connection) {
                    console.log("[MUSIC] Attempting to Join");
                    message.member.voice.channel.join().then(conn => {
                        console.log(`[MUSIC] Joined ${message.member?.voice.channel?.name} on ${message.guild?.name}`);
                        if (message.guild) {
                            playYT(conn, message.guild, message.channel);
                        }
                    });
                }
            });

        }

        return true;
    }
}

export default new PlayCMD("play",
    true,
    "**play <song|url>** - Play Song on YT",
    []);
