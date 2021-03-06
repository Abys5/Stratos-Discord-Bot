import DiscordClient from "../index";
import {readdirSync} from "fs";

export interface Activity {
    message: string;
    type: "WATCHING" | "PLAYING"
}

const activities: {(): Activity}[] = [];

const activityHandler = () => {
    let item = 0;

    readdirSync(__dirname+"/../activities").filter(item => item.endsWith(".ts")).forEach(async (filename) => {
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
    }, 45*1000);
}

export default activityHandler;
export {activities}
