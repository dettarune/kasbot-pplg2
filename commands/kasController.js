const kasService = require('../services/kasService.js');
const monthsMap = require('../utils/monthsMap');
const formattedMoney = require('../utils/formattedMoney');

module.exports = {
    name: 'kas',
    description: 'All about kas command',
    subcommands: [
        { name: 'total', description: 'Cek total kas saat ini' },
        { name: '{nama}', description: 'Cek status kas per orang (bayar atau belum)' },
        { name: 'history {nama}', description: 'Cek history pembayaran kas per orang' },
        { name: 'bayar {nama}', description: 'Bayar kas individu' }
    ],
    async execute(message, args, db, client) {
        if (!args[0]) {
            return message.reply('!kas bisa jalan kalo lu sebutin subcommand atau nama, contoh: !kas total / !kas history {nama} / !kas {nama}');
        }

        const sub = args[0].toLowerCase();

        // !kas total
        if (sub === 'total') {
            const total = await kasService.getTotalKas(db);
            const embed = client.baseEmbed(message)
                .setColor(0x00AE86)
                .setTitle('💰 Kas Kelas')
                .setDescription(`Total kas saat ini: **${formattedMoney(total)}**`);
            return message.reply({ embeds: [embed] });
        }

        // !kas history {nama}
        else if (sub === 'history') {
            const nama = args.slice(1).join(' ');
            const dwada = args.slice(2).join(' ');
            if (!nama) return message.reply('Kurang sebutin nama, contoh: !kas history Andi');

            const history = await kasService.getHistory(db, nama);
            if (!history.length) return message.reply(`Data kas si **${nama}** gaada.`);

            let historyText = '';
            history.forEach(r => {
                const bulanText = monthsMap[r.bulan] || r.bulan;
                const tgl = new Date(r.tanggal);
                const formattedDate = `${String(tgl.getDate()).padStart(2,'0')} ${bulanText} ${tgl.getFullYear()} ${String(tgl.getHours()).padStart(2,'0')}:${String(tgl.getMinutes()).padStart(2,'0')}`;
                historyText += r.jumlah == 0
                    ? `Bulan ${bulanText} Minggu ${r.minggu}: Belum dibayar ❌\n` 
                    : `Bulan ${bulanText} Minggu ${r.minggu}: ${formattedMoney(r.jumlah)} (${formattedDate})\n`;
            });

            const embed = client.baseEmbed(message)
                .setColor(0xFFD700)
                .setTitle(`📜 History Kas ${nama}`)
                .setDescription(historyText);
            return message.reply({ embeds: [embed] });
        }

        // !kas {nama}
        else {
            const nama = args.join(' ');
            const status = await kasService.getStatus(db, nama);

            if (!status) return message.reply(`Data kas si **${nama}** di bulan ini gaada.`);

            const embed = client.baseEmbed(message)
                .setColor(0x3498db)
                .setTitle(`📊 Status Kas ${nama} di bulan ${status.bulanText}`)
                .addFields(
                    { name: 'Nama', value: nama, inline: true },
                    { name: 'Absen', value: status.absen.toString(), inline: true },
                    { name: 'Bulan', value: status.bulanText, inline: true },
                    { name: 'Detail Mingguan', value: status.detail }
                );
            return message.reply({ embeds: [embed] });
        }
    }
};