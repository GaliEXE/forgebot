require('dotenv').config();
const { token } = process.env
const { Client, Collection, GatewayIntentBits, Events, PermissionsBitField, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.login(token);
client.handleCommands();

client.on('guildMemberAdd', guildMember => {
    try {
        const joinRole = guildMember.guild.roles.cache.find(role => role.name === 'Unverified');
        guildMember.roles.add(joinRole);
        guildMember.guild.channels.cache.get('1277578261265911880').send(`Welcome To The Team Forge Community <@${guildMember.user.id}>!`);
    } catch (error) {
        console.error('Error in guildMemberAdd event:', error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'verification') return;

    try {
        await interaction.deferUpdate();

        const member = interaction.member;
        const removeID = member.roles.cache.has('1279566495780831262');
        const removeRole = '1279566495780831262';
        if (removeID) {
            console.log('things are happening ig')
            await member.roles.remove(removeRole);
        } else {
            await interaction.followUp({ content: 'You Have Already Been Verified', ephemeral: true });
        }
    } catch (error) {
        console.error('Something went wrong during verification', error);
    }
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'helpbtn') return;

    try{
        await interaction.deferUpdate();
        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1279852038124998667';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s ticket`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
        .then(() => console.log('Succesfully synchronized permissiosn with parent channel'))
        .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, {ViewChannel: true});
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton);

        const embed = new EmbedBuilder()
        .setTitle('Ticket Information')
        .setDescription(`**Wecome to your ticket** <@${member.user.id}>!
            Tell us what you need help with and a staff member will help you shortly`)
        .setColor('#0099ff')
        .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId !== 'trialButton') return;

    try{
        await interaction.deferUpdate();
        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1279852038124998667';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s application`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
        .then(() => console.log('Succesfully synchronized permissiosn with parent channel'))
        .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, {ViewChannel: true});
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton);

        const embed = new EmbedBuilder()
        .setTitle('Ticket Information')
        .setDescription(`**Wecome to your ticket** <@${member.user.id}>!
            To Apply for the Furnace trials fill out the application link.
        [Furnace Trial Application](https://forms.gle/DJBKTneL8mFFC4uP7)
        Once completed a staff member will post your results in this ticket!
        **Reminder:** Don't ping staff for updates on your application. 
        It may result in your submission being automatically declined.`)
        .setColor('#0099ff')
        .setFooter({ text: 'Created By Gali.exe For The Muletopia Community', iconURL: "https://raw.githubusercontent.com/GaliEXE/Bridge-Duels-Bot/main/ChannelLogo.png" });

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        // Check if the interaction is a button click
        const customId = interaction.customId;

        if (customId === 'closeticket') {
            // Handle close ticket button click
            const member = interaction.member;
            const username = member.user.username;

            // Get the channelId from the interaction
            const channelId = interaction.channelId;

            // Find the ticket channel by channelId
            const ticketChannel = interaction.guild.channels.cache.get(channelId);

            if (ticketChannel) {
                // Delete the ticket channel
                await ticketChannel.delete();

                // You can add additional logic here if needed
            } else {
                await interaction.reply({ content: 'Ticket channel not found.', ephemeral: true });
            }
        }
    }
});