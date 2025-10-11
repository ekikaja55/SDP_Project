
---
# **SDP_Project — Fullstack (SvelteKit + Express + MongoDB)**

## **Deskripsi Umum**
Proyek ini dikembangkan untuk keperluan tugas mata kuliah **Software Development Project**
---

## **Struktur Kembalian Data Response Backend**

Backend selalu mengembalikan data dengan format:

```json
{
  "message": "Keterangan proses (success/error)",
  "result": {} | [] | null //dapat berupa apa aja
}
```

## **Struktur Direktori**

```bash
SDP_Project/
├── frontend/
│   └── src/
│       ├── app.css
│       ├── app.d.ts
│       ├── app.html
│       ├── lib/
│       │   ├── api/
│       │   │   ├── api.ts
│       │   │   └── index.ts
│       │   ├── index.ts
│       │   ├── stores/
│       │   │   ├── index.ts
│       │   │   └── userStore.ts
│       │   └── types/
│       │       ├── index.ts
│       │       ├── metodeBayar.ts
│       │       ├── produk.ts
│       │       ├── review.ts
│       │       ├── todolist.ts
│       │       ├── transaksiDetail.ts
│       │       ├── transaksi.ts
│       │       └── user.ts
│       └── routes/
│           ├── +layout.svelte
│           ├── +page.svelte          # Landing page
│           ├── login/
│           │   └── +page.svelte      # Halaman login
│           ├── register/
│           │   └── +page.svelte      # Halaman register
│           └── dashboard/
│               └── +page.svelte      # Halaman dashboard setelah login
│
└── backend/
    ├── index.js                      # Entry point Express server
    ├── routes/
    │   └── auth.js                   # Route login & register
    ├── controllers/
    │   └── authController.js         # Logic autentikasi
    ├── models/
    │   └── userModel.js              # ORM / schema user
    └── utils/
        ├── jwt.js                    # Helper JWT
        └── db.js                     # Koneksi database
```

---

## **Alur Sistem**

```text
[User Action]
    │
    ▼
[+page.svelte (Login/Register)]
    │ memanggil fungsi userStore.login() / register()
    ▼
[userStore.ts]
    │ memanggil API menggunakan Axios
    ▼
[api.ts]
    │ mengirim request ke backend (Express)
    ▼
[Express Backend]
    │ validasi akun, kirim kembali JWT + data user
    ▼
[userStore.ts]
    │ simpan user + token ke store
    ▼
[Dashboard +page.svelte]
    │ menampilkan data user dari store
```

---

## **Konsep Dasar: JSDoc untuk Dokumentasi**

**JSDoc** adalah sistem komentar standar yang bisa dibaca oleh IDE (seperti VSCode) untuk:

- Menyediakan _intellisense_ atau tooltip otomatis.
- Membantu TypeScript mengenali tipe data.
- Menjelaskan fungsi, parameter, return type, dan generic type dengan cara yang lebih deskriptif.

---

## **Format Dasar JSDoc**

```ts
/**
 * Deskripsi umum fungsi / class / type.
 * Bisa lebih dari satu baris.
 *
 * @tag parameter tambahan
 */
```

---

## **Tag Dasar yang Umum Digunakan**

| Tag           | Fungsi                                     | Contoh                                     |
| ------------- | ------------------------------------------ | ------------------------------------------ |
| `@param`      | Menjelaskan parameter fungsi               | `@param name Nama user yang akan login.`   |
| `@returns`    | Menjelaskan nilai balik fungsi             | `@returns Objek user yang sudah login.`    |
| `@template`   | Menjelaskan generic type (`<T>`)           | `@template T Tipe data hasil respons API.` |
| `@type`       | Menjelaskan tipe variabel                  | `@type {number}`                           |
| `@typedef`    | Membuat alias tipe data                    | `@typedef {Object} User`                   |
| `@example`    | Memberikan contoh penggunaan               | `@example const u = getUser('123');`       |
| `@deprecated` | Menandai fungsi sudah tidak digunakan lagi | `@deprecated Gunakan getUserV2()`          |

---

## **Contoh Implementasi JSDoc di TypeScript**

### 1. Fungsi Biasa

```ts
/**
 * Menghitung total harga setelah diskon.
 *
 * @param {number} harga - Harga asli produk.
 * @param {number} diskon - Diskon dalam persen (0–100).
 * @returns {number} Harga akhir setelah diskon diterapkan.
 * @example
 * const hargaAkhir = hitungDiskon(100000, 20);
 * console.log(hargaAkhir); // 80000
 */
function hitungDiskon(harga: number, diskon: number): number {
  return harga - harga * (diskon / 100);
}
```

### 2. Interface dengan Generic

```ts
/**
 * @template T
 * Response standar dari API backend.
 *
 * @property {string} message - Pesan dari server.
 * @property {T} result - Data hasil query (bisa objek, array, atau nilai tunggal).
 * @example
 * type GetUserResponse = ApiResponse<User>;
 */
export interface ApiResponse<T> {
  message: string;
  result: T;
}
```

### 3. Store Global

```ts
/**
 * Store global untuk state user login.
 *
 * @example
 * userStore.subscribe(user => console.log(user));
 */
export const userStore = writable<User | null>(null);
```

### 4. Fungsi Asynchronous

```ts
/**
 * Mengambil data produk dari server.
 *
 * @async
 * @returns {Promise<ApiResponse<Produk[]>>} Daftar produk dari API backend.
 */
export async function getProduk() {
  return await api.get<ApiResponse<Produk[]>>("/produk");
}
```

---

## **Perbandingan `any`, `unknown`, dan `<T>`**

| Jenis     | Penjelasan                                                      | Kelebihan                           | Kekurangan                           |
| --------- | --------------------------------------------------------------- | ----------------------------------- | ------------------------------------ |
| `any`     | Tipe paling longgar. Menonaktifkan pengecekan tipe.             | Cepat untuk debugging.              | Menghilangkan keunggulan TypeScript. |
| `unknown` | Mirip `any`, tapi lebih aman karena butuh pengecekan tipe dulu. | Aman untuk data eksternal.          | Perlu `type guard`.                  |
| `<T>`     | Generic type parameter untuk fleksibilitas fungsi/kelas/type.   | Reusable dan kuat secara type-safe. | Perlu deklarasi eksplisit.           |

Contoh paling aman:

```ts
export interface ApiResponse<T = unknown> {
  message: string;
  result: T;
}
```

---

## **Alur Autentikasi JWT**

1. User mengisi form login/register di SvelteKit.
2. `userStore.ts` mengirim data ke endpoint Express `/auth/login` atau `/auth/register`.
3. Backend memverifikasi kredensial user di database.
4. Jika berhasil, backend mengembalikan:

   ```json
   {
     "user": { "id": 1, "user_nama": "Rizki", "user_email": "rizki@mail.com" },
     "token": "eyJhbGciOiJIUzI1..."
   }
   ```

5. Token disimpan di `localStorage` dan `userStore`.
6. Setiap request berikutnya dikirim dengan header `Authorization: Bearer <token>`.

---

## **Frontend — SvelteKit**

Contoh `api.ts`, `userStore.ts`, dan `+page.svelte` sudah ditulis dengan rapi pada bagian atas.

---

## **Backend — Express.js**

Struktur backend memisahkan `controller`, `route`, dan `utility`, sehingga setiap fungsi memiliki tanggung jawab yang jelas.
Contoh endpoint utama: `/auth/register` dan `/auth/login`.

---

## **Menjalankan Proyek**

### Frontend (SvelteKit)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Express)

```bash
cd backend
npm install
npm run start
```

Akses:

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:5000/api](http://localhost:5000/api)

---

## **Tim Pengembang**

| Nama                     | NRP       | Peran              | Kontribusi Utama                 |
| ------------------------ | --------- | ------------------ | -------------------------------- |
| Rizki Arkant Pratama     | 223011701 | Frontend Developer | Implementasi SvelteKit UI & Auth |
| Alender Rico Wong        | 223011699 | Frontend Developer | UI Page Login & Register         |
| Fabian Kurniawan Limanto | 223011701 | Backend Developer  | API Auth Express & JWT           |

---

## **Catatan Teknis**

- File `+server.ts` tidak digunakan karena seluruh request diarahkan ke backend Express.
- Jika sistem dikembangkan menjadi **SSR dengan proteksi route**, middleware dapat diletakkan di `hooks.server.ts`.

---

## **Lisensi**

MIT License — Bebas digunakan untuk keperluan akademik maupun pengembangan pribadi.

---

## **Penutup**

Dokumentasi ini dibuat untuk membantu developer memahami arsitektur dan alur kerja sistem **SvelteKit + Express + JWT Authentication** secara menyeluruh, mulai dari frontend, backend, hingga integrasi token.

---
