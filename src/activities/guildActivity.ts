import {Activity} from "../handlers/activityHandler";
import DiscordClient from "../index";

const guildActivity = (): Activity => {
    const guildAmount = DiscordClient.guilds.cache.size;
    return {message: `${guildAmount} Guild${guildAmount == 1 ? "" : "s"}`, type: "WATCHING"};
}

export default guildActivity;