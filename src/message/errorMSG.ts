import {Message, MessageEmbed} from "discord.js";

export default (e: string, desc: string, message: Message) => {
    const embed = new MessageEmbed();
    embed.setColor(0xff0000)
        .setTitle("Error has Occurred")
        .setDescription(desc)
        .addField("Error", e)
        .setFooter("Guild: "+message.guild)
        .setTimestamp(Date.now());

    message.channel.send(embed).then(r => {
        if (message.guild) {
            console.log(`[ERROR] ${e} @ ${message.guild.id}`)
        } else {
            console.log(`[ERROR] ${e} @ User ${message.author.username+"#"+message.author.discriminator}`)
        }
    });
}
