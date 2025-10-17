
---

# Kanti's Store Backend API

Sistem backend untuk aplikasi **Kanti's Store**, dibangun menggunakan **Express.js** dengan arsitektur modular.
Menyediakan berbagai endpoint untuk autentikasi, manajemen produk, dan daftar tugas (todolist).

---

## Fitur Utama

### Autentikasi
- Register & Login User
- Refresh Token
- Logout
- Validasi input menggunakan **Joi**

### Produk
- Upload gambar produk menggunakan **Multer**
- Penyimpanan file otomatis di folder `/uploads`
- Operasi CRUD produk

### Todolist
- Tambah, ubah, hapus, dan ambil daftar tugas
- Perubahan status tugas secara berurutan:
  `Belum Dikerjakan → Sedang Dikerjakan → Selesai`
- Dukungan query `status` untuk filter hasil

---

## Teknologi yang Digunakan

| Teknologi | Deskripsi |
|------------|------------|
| **Express.js** | Framework utama untuk REST API |
| **Prisma ORM** | Abstraksi database dan query builder |
| **JWT (jsonwebtoken)** | Autentikasi berbasis token |
| **Multer** | Middleware upload file |
| **CORS** | Mengatur akses domain frontend |
| **dotenv** | Manajemen environment variable |
| **JSDoc** | Dokumentasi otomatis API |

---

## Struktur Proyek

```

.
├── docs/                # Hasil dokumentasi JSDoc
├── src/
│   ├── controllers/     # Logika utama setiap endpoint
│   ├── middleware/      # Middleware upload, auth, dll.
│   ├── routes/          # Definisi routing API
│   └── utils/           # Validasi dan helper
├── prisma/              # Konfigurasi Prisma ORM
├── uploads/             # Folder penyimpanan file produk
├── .env                 # Variabel lingkungan
├── index.js             # Entry point utama server
├── jsdoc.json           # Konfigurasi dokumentasi
└── README.md

````

---

## Endpoint Utama

| Endpoint | Method | Deskripsi |
|-----------|---------|-----------|
| `/api/v1/auth/register` | `POST` | Registrasi pengguna baru |
| `/api/v1/auth/login` | `POST` | Login dan mendapatkan token |
| `/api/v1/product` | `GET` | Ambil semua produk |
| `/api/v1/todolist` | `GET` | Ambil semua todo list |
| `/api/v1/todolist/:id` | `PUT` | Update status atau deskripsi todo list |

---

## Menjalankan Server

### 1. Install dependency
```bash
npm install
````

### 2. Atur environment

Buat file `.env` di root project:

```
DATABASE_URL="mysql://root:password@localhost:3307/kantistore"
JWT_SECRET="your_secret_key"
```

### 3. Jalankan server

```bash
node index.js
```

Server akan berjalan di:

```
http://localhost:3000
```

---

## Dokumentasi API

Dokumentasi otomatis dibuat menggunakan **JSDoc**.

### Generate dokumentasi:

```bash
npx jsdoc -c jsdoc.json
```

Hasilnya akan tersimpan di folder:

```
/docs/index.html
```

---

## Contoh Request

### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "user_nama": "Fabaon",
  "user_email": "fabaon55@gmail.com",
  "user_password": "123456",
  "user_confirm_password": "123456"
}
```

**Response:**

```json
{
  "message": "Sukses Register, silahkan login",
  "result": null
}
```

---

### Error Example

```json
{
  "message": "Terjadi kesalahan pada server",
  "result": null
}
```
