export default {
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(interaction) {
        interaction.reply('Meow!');
    },
};