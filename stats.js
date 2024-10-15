const { SlashCommandBuilder } = require('discord.js');
const fetch = require('isomorphic-fetch');
//const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
//const { MockedProvider } = require('@apollo/client/testing');
const { APIKEY } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('[BETA] Obtains MCCI Stats')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Minecraft Username')
                .setRequired(false)
        ),

    async execute(interaction) {

        const client = new ApolloClient({
            uri: 'https://api.mccisland.net/graphql',
            cache: new InMemoryCache(),
        });

        client.query = gql`
            query player($uuid: String!) {
                player(uuid: $uuid) {
                    uuid
                    ranks
                }
            }
        `;

        // Define your query variables
        const variables = {
            uuid: '83073fcf78e4491d9fa115f2eb3bf018',
        };

        try {
            // Make the request using node-fetch
            const response = await fetch('https://api.mccisland.net/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${APIKEY}`, // Use the API key from your environment variables
                },
                body: JSON.stringify({
                    query: query.loc.source.body, // Send query string
                    variables: variables,
                }),
            });

            // Parse the JSON response
            const result = await response.json();

            // Handle the result (log it or process it as needed)
            console.log(result.data);
            
            await interaction.reply("Testing stuff in console");
        } catch (error) {
            // Handle any errors
            console.error(error);
            await interaction.reply("An error occurred while fetching data.");
        }
    }
};
