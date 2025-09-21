
-- blm dibuat
CREATE TABLE anggota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    absen VARCHAR(2) NOT NULL,
);



--table kas
CREATE TABLE kas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL,
    absen INT NOT NULL,
    jumlah INT NOT NULL,
    bulan INT NOT NULL,
    minggu INT NOT NULL,
    tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP --kalo mau insert gausah diisi, udah ngambil tanggal sekarang
);


--table list tugas
CREATE TABLE tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hari VARCHAR(20) NOT NULL,
    isi_tugas TEXT NOT NULL
);