# 📖 Panduan Menggunakan Template Undangan Web

Undangan ini sudah didesain sedemikian rupa sehingga Anda bisa menggunakannya berkali-kali (sebagai template) untuk mempelai yang berbeda. 

Berikut adalah langkah-langkah mudah yang bisa Anda ikuti:

## 1. Duplikat (Copy) Folder Proyek
Langkah pertama dan paling penting adalah **jangan mengedit folder aslinya langsung**. 
Silahkan `Copy` folder **"UNDANGAN DIGITAL WIDY"** dan `Paste` di tempat yang sama, kemudian ubah nama foldernya sesuai nama klien/mempelai baru, contoh: **"UNDANGAN RINA & BUDI"**.
Edit file yang ada di dalam folder baru tersebut.

## 2. Mengganti Gambar & Foto
Ganti foto-foto mempelai dengan foto baru, masuk ke folder baru Anda, dan ganti file (replace) dengan memastikan nama file persis sama atau Anda bisa memasukan foto baru lalu me-rename/mengganti namanya di dalam `index.html`. 

Rekomendasi nama file yang harus diubah:
- **`bg11.jpg`** : Foto melayang di halaman paling depan (Cover).
- **`pria.png`** / **`pria.jpg`** : Foto profil Mempelai Pria (Sebaiknya transparan/tanpa background agar menyatu dengan bingkai).
- **`wanitanew.png`** / **`wanita.jpg`** : Foto profil Mempelai Wanita.
- **Background Utama** : `bg1new.jpg`, `bg2new.jpg`, `bg3new.jpg`, `bg5new.jpg` (Jika Anda ingin latarnya berbeda tiap pesta).
- **`BRI.png`** : Logo Bank pada bagian "Wedding Gift" (Bisa diganti logo BCA, Mandiri, dll).

## 3. Mengganti Teks di File `index.html`
Buka file `index.html` (menggunakan VSCode atau text editor), dan ubah teks-teks berikut:

- **Baris 7 & 8:** `<title>` dan `<meta description>` untuk judul di tab browser.
- **Baris ~30:** Nama di bagian Cover Depan (`<h1 class="couple-names-cover"> Widy & Riswar </h1>`).
- **Baris ~60:** Nama besar di bagian dalam Undangan (Hero).
- **Baris ~65:** Tanggal utama di bawah nama.
- **Baris ~117 - 120:** Ganti nama lengkap Mempelai Wanita (`Gr. Widyawati, S.Pd`) beserta nama Bapak dan Ibunya.
- **Baris ~138 - 140:** Ganti nama lengkap Mempelai Pria (`Gr. Riswar Hasan, S.Pd`) beserta nama Bapak dan Ibunya.
- **Baris ~160 - 186:** Rangkaian Acara (Akad Nikah, Resepsi, dll). Jangan lupa perbarui **hari, jam, dan lokasi** pelaksanaannya.
- **Baris ~212 - 217:** Ganti Nomor Rekening (Di elemen `<p class="bank-account">`) & Nama Pemilik Rekening (`a.n WIDYAWATI`).
- **Baris ~223:** Ubah nilai atribut "Salin Rekening" -> `navigator.clipboard.writeText('MASUKAN_NOMOR_REKENING_DISINI')`.

## 4. Mengubah Hitung Mundur (Countdown) & Pengaturan di `script.js`
Buka file `script.js` dan ubah beberapa data penting ini:

- **[Hitung Mundur] Baris ~58:**
  Cari teks: `const targetDate = new Date("May 23, 2026 09:00:00").getTime();`
  Ubah bagian tanggal (Format: `Bulan Tanggal, Tahun Jam:Menit:Detik` memakai penamaan bahasa inggris seperti *June, July, August*).
- **[Database Ucapan] Baris ~140, 180, & 192:**
  Cari kata `weddingWishes_WidyRiswar` dan ubah menjadi sesuai mempelainya, contoh `weddingWishes_RinaBudi`. Ini penting agar daftar buku tamu/pesan klien Anda tidak tercampur dengan template/undangan lainnya saat dibuka di komputer yang sama.

## 5. Mengganti Musik Latar (Backsound)
Ganti file `musikkkk.mp3` dengan lagu yang Anda inginkan (Pastikan nama filenya tetap sama, atau jika nama file MP3-nya diubah, ingat untuk mengubahnya pada file `index.html` letaknya di baris kode nomor **~242** tepat sebelum tag `</body>`).
