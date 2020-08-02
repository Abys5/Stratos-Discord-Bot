import {Activity} from "../handlers/activityHandler";
import DiscordClient from "../index";

const helpActivity = (): Activity => {
    return {message: `for s!help to be used!`, type: "WATCHING"};
}

export default helpActivity;
