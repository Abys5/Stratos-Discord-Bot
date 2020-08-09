import ICommand from "../interface/ICommand";
import {commandMap} from "../handlers/commandHandler";
import {
    Channel,
    Guild,
    GuildMember,
    GuildMemberResolvable,
    Message,
    MessageEmbed,
    StreamDispatcher, TextChannel,
    VoiceConnection
} from "discord.js";
import ytdl from "ytdl-core";
const YTAPI = require("discord-youtube-api");
import errorMSG from "../message/errorMSG";
import nowPlayingMSG from "../message/nowPlayingMSG";
import addQueueMSG from "../message/addQueueMSG";
import config from '../config.json';

const Youtube = new YTAPI(config.ytDataV3APIKey);

interface queueItem {
    name: string;
    url: string;
}

let servers: { [key: string]: { queue: queueItem[], dispatcher: StreamDispatcher | null }} = {};

function playYT(connection: VoiceConnection, guild: Guild, channel: Channel) {
    var server = servers[guild.id];

    console.log(`[MUSIC] Playing ${server.queue[0].name}`);

    let song = server.queue[0];
    nowPlayingMSG(song.name, song.url, <TextChannel>channel);

    server.dispatcher = connection.play((ytdl(server.queue[0].url, { filter: "audioonly"}))).on("finish", () => {
        console.log(`[MUSIC] Song ${server.queue[0].name} Finishing @ ${guild.name} | ${guild.id}`);
        server.queue.shift();
        if (song) {
            playYT(connection, guild, channel);
        } else {
            connection.disconnect();
        }
    })

}

async function addQueue(param: string, guildID: string, channel: TextChannel) {
    var server = servers[guildID];



    if (RegExp("^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$").test(param)) {
        let vid = await Youtube.getVideo(param);
        server.queue.push({url: vid.url, name: vid.title});
    } else {
        let vid = await Youtube.searchVideos(param);
        server.queue.push({url: vid.url, name: vid.title});
    }

    let song = server.queue[server.queue.length-1];
    console.log(`[MUSIC] Added ${song.name} to queue for ${guildID}`);
    addQueueMSG(song.name, song.url, channel);
}

const musicCMD: ICommand = {desc: "Plays Music From YT \n **play <song|url>** - Play Song on YT \n **stop** - Stops all Music and leaves \n **queue** - View the Queue", guildOnly: true, execute: (args, message) => {
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

                    if (!(message.channel instanceof TextChannel)) {
                        errorMSG("You somehow sent a text message in a voice channel", "", message);
                        return true;
                    }

                    if (!servers[message.guild.id]) {
                        servers[message.guild.id] = {
                            queue: [],
                            dispatcher: null
                        }
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




                    return true;


                case "skip":
                    var server = servers[message.guild.id];
                    server.queue.shift();
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

                        embed.addField(i+1, server.queue[i].name);
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
