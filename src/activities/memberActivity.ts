import {Activity} from "../handlers/activityHandler";
import DiscordClient from "../index";

const memberActivity = (): Activity => {
    let memberCount = 0;
    DiscordClient.guilds.cache.forEach((guild) => {
        memberCount += guild.memberCount;
    });
    return {message: `${memberCount} User${memberCount == 1 ? "" : "s"}`, type: "WATCHING"};
}

export default memberActivity;