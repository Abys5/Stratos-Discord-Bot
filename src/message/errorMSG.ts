import {Message, MessageEmbed} from "discord.js";

export default (e: any, message: Message) => {
    const embed = new MessageEmbed();
    embed.setColor(0xff0000)
        .setTitle("Error has Occurred")
        .setDescription("Send this to the Dev if it continues!")
        .addField("Error", e)
        .addField("Invite", "To be Added")
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
