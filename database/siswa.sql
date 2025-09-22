CREATE TABLE siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    deskripsi VARCHAR(50) NULL,
    absen INT NULL,
    tanggal_ultah DATE NULL,
    kelas VARCHAR(50) NOT NULL,
    foto_profile VARCHAR(512) NULL
);

INSERT INTO siswa (nama_lengkap, nickname, deskripsi, tanggal_ultah, kelas, foto_profile)
VALUES
('Zulfiqar Silmy Setiawan', 'fiqarsilmy' , 'Playing Visual Code', '2007-05-22', '11 PPLG 2', 'https://mazda.com.my/media/4zidmhfz/m3-herobanner-2022.jpg'),
('Amir Fattah', 'detarune', 'Playing Visual Code', '2007-05-22', '11 PPLG 2', 'https://mazda.com.my/media/4zidmhfz/m3-herobanner-2022.jpg' )
