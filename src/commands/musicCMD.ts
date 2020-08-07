import ICommand from "../interface/ICommand";
import {commandMap} from "../handlers/commandHandler";
import {
    Channel,
    Guild,
    GuildMember,
    GuildMemberResolvable,
    Message,
    MessageEmbed,
    StreamDispatcher,
    VoiceConnection
} from "discord.js";
import ytdl from "ytdl-core";
import errorMSG from "../message/errorMSG";

let servers: { [key: string]: { queue: string[], dispatcher: StreamDispatcher | null }} = {};

function playYT(connection: VoiceConnection, link: string, guild: Guild, channel: Channel) {
    var server = servers[guild.id];

    console.log(`[MUSIC] Playing ${server.queue[0]}`);

    server.dispatcher = connection.play((ytdl(server.queue[0], { filter: "audioonly"}))).on("finish", () => {
        console.log(`[MUSIC] Song ${server.queue[0]} Finishing`);
        server.queue.shift();
        if (server.queue[0]) {
            playYT(connection, link, guild, channel);
        } else {
            connection.disconnect();
        }
    })

}

const musicCMD: ICommand = {desc: "Plays Music From YT", guildOnly: true, execute: (args, message) => {
        try {
            message.delete({reason: "Stratos Auto Delete"})

            if (message.guild == null) {
                errorMSG("This is not in a Guild", "", message);
                return true;
            }


            switch (args[0]) {
                case "play":
                    if (!args[1]) {
                        message.channel.send("No Song Provided").then(r => {
                            r.delete({timeout: 2000, reason: "Stratos Auto Delete"})
                        })
                        return true;
                    }

                    var permissions = message.member?.voice.channel?.permissionsFor(<GuildMemberResolvable>message.guild.me);

                    if (!permissions?.has("CONNECT")){
                        errorMSG("Unable to connect in this voice channel", "Permission Denied", message);
                        return true;
                    }

                    if (!permissions?.has("SPEAK")){
                        errorMSG("Unable to speak in this voice channel", "Permission Denied", message);
                    }

                    if (!message.member?.voice.channel) {
                        errorMSG("Unable to play as user is not in a voice channel", "", message);
                        return true;
                    }

                    if (!servers[message.guild.id]) {
                        servers[message.guild.id] = {
                            queue: [],
                            dispatcher: null
                        }
                    }

                    var server = servers[message.guild.id];

                    console.log(`[MUSIC] Adding ${args[1]} to queue for ${message.guild.id}`);
                    server.queue.push(args[1]);


                    if (!message.guild.voice?.connection) {
                        console.log("[MUSIC] Attempting to Join");
                        message.member.voice.channel.join().then(conn => {
                            console.log(`[MUSIC] Joined ${message.member?.voice.channel?.name} on ${message.guild?.name}`);
                            if (message.guild) {
                                playYT(conn, args[1], message.guild, message.channel);
                            }
                        });
                    }

                    return true;


                case "skip":
                    var server = servers[message.guild.id];
                    if (server.dispatcher) server.dispatcher.end();
                    return true;


                case "stop":
                    if (message.guild.voice) {
                        var server = servers[message.guild.id];
                        for (var i = server.queue.length - 1; i>=0; i--) {
                            server.queue.splice(i, 1)
                        }
                        if (server.dispatcher) server.dispatcher.end();
                    }
                    return true;

                case "queue":
                    var server = servers[message.guild.id];
                    if (!server) {
                        errorMSG("No Server Queue Initialized", "Contact the developer if this continues", message);
                        return true;
                    }
                    const embed = new MessageEmbed();
                    embed.setTitle("Music Queue");
                    for (let i = 0; i < 5; i++) {
                        if (!server.queue[i])
                            continue;

                        embed.addField(i, server.queue[i]);
                    }

                    message.channel.send(embed);
                    return true;
            }


            errorMSG("Feature Not Added", "", message);
            return true;



        } catch (e) {
            errorMSG(e, "Contact the developer if this continues", message);
            throw e;
        }
    return true;
}}

commandMap.set("music", musicCMD);
