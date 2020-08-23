import config from "../config.json";
import {Channel, Guild, StreamDispatcher, TextChannel, VoiceConnection} from "discord.js";
import nowPlayingMSG from "../message/nowPlayingMSG";
import ytdl from "ytdl-core";
import addQueueMSG from "../message/addQueueMSG";
import YTAPI from 'discord-youtube-api';
import DiscordClient from "../index";


const Youtube = new YTAPI(config.ytDataV3APIKey);

interface queueItem {
    name: string;
    url: string;
    thumbnail: string;
}

let servers: { [key: string]: { queue: queueItem[], dispatcher: StreamDispatcher | null }} = {};

DiscordClient.guilds.cache.forEach(value => {
    console.log(`[MUSIC] Init Server Queue for ${value.name}`)
    servers[value.id] = {
        queue: [],
        dispatcher: null
    }
})

function playYT(connection: VoiceConnection, guild: Guild, channel: Channel) {
    var server = servers[guild.id];

    let song = server.queue[0];
    if (song) {
        server.dispatcher = connection.play((ytdl(server.queue[0].url, { filter: "audioonly"}))).on("start", () => {
            console.log(`[MUSIC] Playing ${server.queue[0].name} with ${song.thumbnail}`);
            nowPlayingMSG(song.name, song.url, song.thumbnail, <TextChannel>channel);
        }).on("finish", () => {
            console.log(`[MUSIC] Song ${server.queue[0].name} Finishing @ ${guild.name} | ${guild.id}`);
            server.queue.shift();
            if (song) {
                playYT(connection, guild, channel);
            } else {
                connection.disconnect();
            }
        })
    } else {
        connection.disconnect();
    }

}

async function addQueue(param: string, guildID: string, channel: TextChannel) {
    var server = servers[guildID];

    console.log(param);

    if (RegExp("^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$").test(param)) {
        let vid = await Youtube.getVideo(param);
        server.queue.push({url: vid.url, name: vid.title, thumbnail: vid.thumbnail});
    } else {
        let vid = await Youtube.searchVideos(param);
        server.queue.push({url: vid.url, name: vid.title, thumbnail: vid.thumbnail});
    }

    let song = server.queue[server.queue.length-1];
    console.log(`[MUSIC] Added ${song.name} to queue for ${guildID}`);
    addQueueMSG(song.name, song.url, channel);
}

export {
    servers as serverQueues,
    playYT,
    addQueue
}
