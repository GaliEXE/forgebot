const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder ()
        .setName('embedtickets')
        .setDescription('Sends the Ticket Embed')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel to send the embed to.')
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        const member = interaction.member;
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.followUp({ content: 'You do not have permission to run this command!', ephemeral: true})
            console.log('Unauthorized Command Usage!');
            return;
        }

        const helpBtn = new ButtonBuilder()
            .setCustomId('helpbtn')
            .setLabel('Help Desk')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const trialForgeBtn = new ButtonBuilder()
            .setCustomId('trialButton')
            .setLabel('Forge Trial')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const staffAppBtn = new ButtonBuilder()
            .setCustomId('staffbtn')
            .setLabel('Staff App')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(helpBtn)
            .addComponents(trialForgeBtn)
            .addComponents(staffAppBtn);

        const embedmsg = `__**Welcome to the ticket hub!**__\n
        If you need help click the **Help Button**\n
        If you would like to register for the Furnace Trials click **Forge Trial**\n
        We are currently not accepting staff applications we may change this in the future!`

        const ticketEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Ticket Hub')
            .setDescription(embedmsg)
            .setFooter({ text: 'Created By Gali.exe For The Team Forge Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        if(channel) {
            await channel.send({ embeds: [ticketEmbed] });
            await channel.send({ components: [row] });
            await interaction.editReply({ content: 'Embed Successfully Inserted'})
        } else {
            console.log('Specified Channel Not Found');
            await interaction.editReply({ content: 'Specified channel not found', ephemeral: true});
        }
    }
}