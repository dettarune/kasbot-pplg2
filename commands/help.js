module.exports = {
    name: 'help',
    description: 'Menampilkan daftar command yang tersedia',
    async execute(message, args, db, client) {
        const commands = client.commands;
        const embed = client.baseEmbed(message)
            .setTitle('📖 Daftar Command')
            .setColor(0xFFA500);

        commands.forEach(cmd => {
            if (cmd.subcommands) {
                cmd.subcommands.forEach(sub => {
                    embed.addFields({ name: `!${cmd.name} ${sub.name}`, value: sub.description, inline: false });
                });
            } else {
                embed.addFields({ name: `!${cmd.name}`, value: cmd.description || 'No description available', inline: false });
            }
        });
        message.reply({ embeds: [embed] });
    }
};