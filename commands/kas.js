const monthsMap = {
    1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
    5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
    9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
};

function formattedKas(num) {
    if (num >= 1000) {
        let formatted = (num / 1000).toFixed(1);
        formatted = formatted.replace(/\.0$/, '');
        return `${formatted}K`;
    }
    return num.toString();
}

module.exports = {
    name: 'kas',
    description: 'All about kas command',
    subcommands: [
        { name: 'total', description: 'Cek total kas saat ini' },
        { name: '{nama}', description: 'Cek status kas per orang (bayar atau belum)' },
        { name: 'history {nama}', description: 'Cek history pembayaran kas per orang' }
    ],
    async execute(message, args, db, client) {
        if (!args[0]) {
            return message.reply('Tolong sebutin subcommand atau nama, contoh: !kas total / !kas history Andi / !kas {nama}');
        }

        const sub = args[0].toLowerCase();

        if (sub === 'total') {
            db.query('SELECT SUM(jumlah) AS total FROM kas', (err, results) => {
                if (err) return message.reply('Error: ' + err.message);

                const total = results[0].total || 0;
                const embed = client.baseEmbed(message)
                    .setColor(0x00AE86)
                    .setTitle('💰 Kas Kelas')
                    .setDescription(`Total kas saat ini: **${formattedKas(total)}**`);

                message.reply({ embeds: [embed] });
            });
        }
        else if (sub === 'history') {
            const nama = args.slice(1).join(' ');
            if (!nama) return message.reply('Kurang sebutin nama, contoh: !kas history Andi');

            db.query('SELECT * FROM kas WHERE nama = ? ORDER BY bulan, minggu', [nama], (err, results) => {
                if (err) return message.reply('Error: ' + err.message);
                if (results.length === 0) return message.reply(`Data kas si **${nama}** gaada.`);

                let historyText = '';
                results.forEach(r => {
                    const bulanText = monthsMap[r.bulan] || r.bulan;
                    const tgl = new Date(r.tanggal);
                    const formattedDate = `${String(tgl.getDate()).padStart(2,'0')} ${bulanText} ${tgl.getFullYear()} ${String(tgl.getHours()).padStart(2,'0')}:${String(tgl.getMinutes()).padStart(2,'0')}`;
                    historyText += `Bulan ${bulanText} Minggu ${r.minggu}: ${formattedKas(r.jumlah)} dibayar tgl ${formattedDate}\n`;
                });

                const embed = client.baseEmbed(message)
                    .setColor(0xFFD700)
                    .setTitle(`📜 History Kas ${nama}`)
                    .setDescription(historyText);

                message.reply({ embeds: [embed] });
            });
        }
        else {
            const nama = args.join(' ');
            db.query('SELECT * FROM kas WHERE nama = ? ORDER BY bulan, minggu', [nama], (err, results) => {
                if (err) return message.reply('Error: ' + err.message);
                if (results.length === 0) return message.reply(`Data kas si **${nama}** gaada.`);

                const absen = results[0].absen;
                const bulan = results[0].bulan;
                const bulanToText = monthsMap[bulan];
                let weeklyStatus = '';
                let notYetPaid = 0;
                const weeklyTarget = 5000;

                for (let i = 1; i <= 4; i++) {
                    const bayar = results.find(r => r.minggu === i);
                    if (bayar && bayar.jumlah >= weeklyTarget) {
                        weeklyStatus += `Minggu ${i} : ✅\n`;
                    } else {
                        weeklyStatus += `Minggu ${i} : ❌ (bayar woi cuma 5 ribu)\n`;
                        notYetPaid += weeklyTarget;
                    }
                }

                let finalStatus = notYetPaid > 0
                    ? `\nTotal kas yang belum dibayar : **${formattedKas(notYetPaid)}**\n`
                    : `\nKas ${nama} udah lunas!\n`;

                const embed = client.baseEmbed(message)
                    .setColor(0x3498db)
                    .setTitle(`📊 Status Kas ${nama}`)
                    .addFields(
                        { name: 'Nama', value: nama, inline: true },
                        { name: 'Absen', value: absen.toString(), inline: true },
                        { name: 'Bulan', value: bulanToText, inline: true },
                        { name: 'Detail Mingguan', value: weeklyStatus + finalStatus }
                    );
                message.reply({ embeds: [embed] });
            });
        }
    }
};
