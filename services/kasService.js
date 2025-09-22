const monthsMap = require('../utils/monthsMap');
const formattedMoney = require('../utils/formattedMoney');

module.exports = {
    getTotalKas(db) {
        return new Promise((resolve, reject) => {
            db.query('SELECT SUM(jumlah) AS total FROM kas', (err, results) => {
                if (err) return reject(err);
                resolve(results[0].total || 0);
            });
        });
    },

    getHistory(db, nama) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM kas WHERE nama = ? ORDER BY bulan, minggu', [nama], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getStatus(db, nama) {
        return new Promise((resolve, reject) => {
            const currMonth = new Date().getMonth() + 1;
            db.query('SELECT * FROM kas WHERE nama = ? AND bulan = ? ORDER BY minggu', [nama, currMonth], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);

                const absen = results[0].absen;
                const bulan = results[0].bulan;
                const bulanText = monthsMap[bulan];
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
                    ? `\nTotal kas yang belum dibayar : **${formattedMoney(notYetPaid)}**\n`
                    : `\nKas ${nama} bulan ini udah lunas!\n`;

                resolve({
                    absen,
                    bulanText,
                    detail: weeklyStatus + finalStatus
                });
            });
        });
    }
};
