import DiscordClient from "../index";
import guildActivity from "../activities/guildActivity";
import memberActivity from "../activities/memberActivity";
import {readdirSync} from "fs";

export interface Activity {
    message: string;
    type: "WATCHING" | "PLAYING"
}

const activityHandler = () => {
    let item = 0;
    const activities: {(): Activity}[] = [];

    readdirSync(__dirname+"/../activities").forEach(async (filename) => {
        const func = await import(`../activities/${filename.replace(".ts", "")}`);
        console.log(`[ACTION: ACT Loaded] ${filename}`);
        activities.push(func.default);
    });

    setInterval(async ()=> {
        const current = activities[item]();

        DiscordClient.user?.setActivity(current.message, {type: current.type})

        if (item >= activities.length - 1) {
            item = 0
        } else {
            item++;
        }

        console.log(`[ACTION: UPDATE_ACT] Updated to ${item}`)
    }, 30*1000);
}

export default activityHandler;