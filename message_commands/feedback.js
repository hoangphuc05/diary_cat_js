

export default {
    name: 'feedback',
    description: 'Send feedback to the bot owner',
    async execute(message, args) {
        await message.reply("`dl!feedback` is now deprecated. Use slash command `/feedback` instead");
    }
}