import {Message, MessageEmbed, TextChannel} from "discord.js";

export default (name: string, url: string, channel: TextChannel) => {
    const embed = new MessageEmbed();
    embed.setColor(0x00ff00)
        .setTitle("Now Playing")
        .addField("Title", name)
        .addField("URL", url)
        .setFooter("Guild: "+channel.guild)
        .setTimestamp(Date.now());

    channel.send(embed).then(r => {
        r.delete({timeout: 5000, reason: "Stratos Auto Delete"});
    });
}
