const { SlashCommandBuilder } = require('discord.js');
const fetch = require('isomorphic-fetch');

module.exports ={
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('automatically assigns your role based on in-game rank')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your Minecraft IGN')
                .setRequired(true)),
    async execute(interaction) {

        const mcUser = interaction.options.get('username').value;
        const userResponce = await fetch(`https://api.mojang.com/users/profiles/minecraft/${mcUser}`)
        const mcUUID = await userResponce.json();
        if (!mcUUID || !mcUUID.id){
            await interaction.editReply('Invalid Minecraft Username!');
            return;
        }
        const mcIdReturn = mcUUID.id;
        console.log(mcIdReturn);
        interaction.reply('This Command is Under Developement at the moment!');
    }
}
