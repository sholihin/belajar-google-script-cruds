#Panduan Penggunaan :

1. Upload dokumen excel ke google spreadsheet
2. Buat script pada tab Extensions/Apps Script
3. Copy source code pada script.js ke Code.gs
4. Klik pada tombol Deploy
5. Pilih New Deployment
6. Pilih Select type nya sebagai Web app
7. Kemudian beri nama description, dan pada who has access pilih Anyone dan klik tombol Deploy
8. Copy URL
9. Buka postman kemudian buat environments baru beri nama sesuai kebutuhan, lalu isi Key dengan url_api dan isi Value dengan URL yang sudah di copy dari google script tadi.
10. Silahkan import postman-google-script.postman_collection.json di postman lalu lakukan pengujian.
11. Selesai, kamu sudah dapat membuat aplikasi menggunakan database google  spreadsheet.