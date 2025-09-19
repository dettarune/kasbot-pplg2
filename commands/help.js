module.exports = {
    name: 'help',
    description: 'Show all available commands',
    async execute(message, client) {
        const commands = client.commands;
        const embed = client.baseEmbed(message)
            .setTitle('📖 Daftar Command')
            .setColor(0xFFA500);

        commands.forEach(cmd => {
            embed.addFields({ name: `!${cmd.name}`, value: cmd.description || 'Tidak ada deskripsi', inline: false });
        });

        message.reply({ embeds: [embed] });
    }
};