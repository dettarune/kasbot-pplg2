const { EmbedBuilder } = require('discord.js');
const monthsMap = require('../utils/monthsMap');
const formattedMoney = require('../utils/formattedMoney');

module.exports = {
    name: 'profile',
    description: 'Menampilkan profil kas seseorang',
    subcommands: [
        { name: '{no. absen}', description: 'Show Profile' }
    ],
    async execute(message, args, db, client) {
        if (!args[0]) {
            return message.reply(' Sebutkan ID/nomor absen, contoh: `!profile 1`');
        }

        const id = args[0].toLowerCase();

        db.query('SELECT * FROM siswa WHERE id = ?', [id], (err, results) => {
            if (err) return message.reply('❌ Error: ' + err.message);
            if (id > 35) {
                return message.reply(`Tidak ada data untuk nomor absen: **${id}**.`);
            }

            const user = results[0];
            const { id: userId, nama_lengkap, nickname, deskripsi, tanggal_ultah, kelas, foto_profile } = user;


            //ini cuma data dummy (sementaraaaa)
            const kasPerMinggu = 5000;
            const historyData = [
                { bulan: 9, minggu: 1, jumlah: 5000, tanggal: '2025-09-22 16:45:55' },
                { bulan: 9, minggu: 2, jumlah: 0, tanggal: null },
                { bulan: 9, minggu: 3, jumlah: 5000, tanggal: '2025-09-22 16:45:55' },
                { bulan: 9, minggu: 4, jumlah: 0, tanggal: null }
            ];

            let historyText = '';
            let totalBayar = 0;

            historyData.forEach(kas => {
                const bulanText = monthsMap[kas.bulan] || `Bulan ${kas.bulan}`;
                if (kas.jumlah > 0) {
                    totalBayar += kas.jumlah;
                    const tgl = new Date(kas.tanggal);
                    const formattedDate = `${tgl.getDate().toString().padStart(2, '0')} ${bulanText} ${tgl.getFullYear()} ${tgl.getHours().toString().padStart(2, '0')}:${tgl.getMinutes().toString().padStart(2, '0')}`;
                    historyText += `• ✅ **${bulanText} Minggu ${kas.minggu}** — ${formattedMoney(kas.jumlah)} *(dibayar: ${formattedDate})*\n`;
                } else {
                    historyText += `• ❌ **${bulanText} Minggu ${kas.minggu}** — Belum dibayar\n`;
                }
            });

            const totalSeharusnya = historyData.length * kasPerMinggu;
            const kurang = Math.max(totalSeharusnya - totalBayar, 0);

            const footerText = kurang > 0
                ? 'Harap Lunasi KAS ke bendahara terdekat'
                : 'Terimakasih, jangan lupa bayar kas minggu depan!';

            const embed = new EmbedBuilder()
                .setColor(kurang > 0 ? 0xFF5555 : 0x55FF55)
                .setTitle(`💳 Profil Kas Siswa - ${nickname}`)
                .setThumbnail(foto_profile || message.author.displayAvatarURL({ dynamic: true, extension: 'png', size: 1024 }))
                .addFields(
                    {
                        name: '💡 About Me',
                        value: deskripsi || 'Tidak ada deskripsi.'
                    },
                    { name: '\u200B', value: '\u200B', inline: false },
                    {
                        name: 'ℹ️ Informasi Siswa',
                        value:
                            `🆔 Absen: \`${userId}\`
                        👤 Nama: **${nama_lengkap}**
                        🔰 Nickname: **${nickname}**
                        🎂 Tanggal Lahir: ${tanggal_ultah ? `<t:${Math.floor(new Date(tanggal_ultah).getTime() / 1000)}:D>` : '❌ Tidak ada'}
                        🏫 Kelas: ${kelas.toString()}`
                                            },
                    { name: '\u200B', value: '\u200B', inline: false },
                    {
                        name: '💰 Status Pembayaran',
                        value: `**Status**: ${kurang > 0 ? `**Kurang: ${formattedMoney(kurang)}**` : '✅ Lunas'}\n**Total**: ${formattedMoney(totalBayar)} / ${formattedMoney(totalSeharusnya)}`
                    },
                    { name: '\u200B', value: '\u200B', inline: false },
                    {
                        name: '📜 Riwayat Pembayaran',
                        value: historyText || '❌ Belum ada riwayat pembayaran'
                    }
                )
                .setFooter({ text: footerText })
                .setTimestamp();


            message.reply({ embeds: [embed] });
        });
    }
};
