
export default {
    name: 'remind',
    aliases: ['remindon', 'remindoff'],
    description: 'Toggle reminder on/off',
    async execute(message, args) {
        await message.reply("`dl!remindon` and `dl!remindoff` is now deprecated. Use slash command `/remind on|off` instead");
    }
}