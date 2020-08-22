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
import errorMSG from "../message/errorMSG";
import nowPlayingMSG from "../message/nowPlayingMSG";
import addQueueMSG from "../message/addQueueMSG";
import config from '../config.json';
import Command from "../classes/command";
import play from "./music/musicPlay";
import musicPlay from "./music/musicPlay";
import musicSkip from "./music/musicSkip";
import musicQueue from "./music/musicQueue";
import musicStop from "./music/musicStop";



class MusicCMD extends Command {
    execute(message: Message, args: string[]): boolean {
        if(super.execute(message, args)) {
            return true;
        };
        message.delete({reason: "Stratos Auto Delete"})
        message.channel.send("INDEX");
        return true;
    }
}

commandMap.push(new MusicCMD("music",
    true,
    "Plays Music From YT",
    [
        musicPlay,
        musicSkip,
        musicQueue,
        musicStop
    ]));
