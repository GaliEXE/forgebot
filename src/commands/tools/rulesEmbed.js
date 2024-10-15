const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { execute } = require('./verify');

module.exports = {
    data: new SlashCommandBuilder ()
        .setName('embedrules')
        .setDescription('Sends a rules embed to specified channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to send the embed to.')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        const member = interaction.member;
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.followUp({ content: 'You do not have permission to run this command.', ephemeral: true });
            console.log('Unauthorized Command Usage!');
            return;
        }

        const rulesText = `
        Team Forge is a casual MCC Island group dedicated to having fun and meeting new friends. To keep things safe and welcoming, we have a few rules:
        =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        **1).** Hatred toward anyone will not be tolerated. Racism, sexism, ableism, bigotry, transphobia, homophobia, biphobia, etc. are all considered forms of hate, and as such are not welcome here.
        **2).** Use common sense. Think about the potential consequences before you do something stupid.
        **3).** People don't revolve around your schedule. Just because you're available doesn't mean others are. Be mindful of others time and do not get upset if someone has other things to attend to.
        **4).** For the benefit of others, please make use of tone indicators. If you are unsure of what those are do some research and don't be afraid to ask questions.
        **5).** Don't ping staff unless absolutely necessary. We are busy!
        **6).** Remember that at the end of everything, it's just a game. We're just here to have fun. Try not to throw a fit if things don't go your way.
        **7).** Profanity is allowed, but don't be excessive, and don't use it in a negative way towards anyone.
        **8).** For the convenience of the staff members, all members will be required to link their Discord account to their Minecraft Java account via the IsleStats Bot. Use the embed in #island-stats!
        **9).** Absolutely under no circumstances in any way shape or form will anyone post NSFW media in this server.
        **10).** Please Follow the MCCI TOS, Discord TOS, and the Discord Community Guidelines links to those below:
    [Noxcrew Code of Conduct](https://mccisland.net/help/rules/)
    [Discord Terms of Service](https://discord.com/terms)
    [Discord Community Guidelines](https://discord.com/guidelines)\n
   **Reminder:** Punishments for violating any of these rules are to the discretion of the staff. So don't break the rules and you won't have to find out what those punishments might be.
    =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

        const rulesEmbed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle("Welcome To Team Forge")
        .setDescription(rulesText)
        .setImage('https://cdn.discordapp.com/attachments/1270112553439203409/1277574223493333022/IMG_3169.png?ex=66d4e977&is=66d397f7&hm=837a7567e526abcf48a2aa312eb4b8f00bf0ac450a4b5b036f429fbe446e1dbc&')
        .setFooter({
            text: "Created by Gali7 for the Team Forge Community",
            iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png",
        });
        
        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        if (channel) {
            channel.send({ embeds: [rulesEmbed] });
            await interaction.editReply({ content: 'Embeds Successfully Inserted' });
            console.log("embed inserted");
        } else {
            await interaction.editReply({ content: 'Err 404: Channel Not Found!'});
            console.log('Specified channel not found');
        }
    }
}
