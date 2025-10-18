# **SDP_Project — Fullstack (SvelteKit + Express + MongoDB)**

## **Deskripsi Umum**

Proyek ini dikembangkan untuk keperluan tugas mata kuliah **Software Development Project**

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

<<<<<<< Updated upstream
Contoh `api.ts`, `userStore.ts`, dan `+page.svelte` sudah ditulis dengan rapi pada bagian atas.
=======

### 📂 **src/lib/api/api.ts**

```ts
import axios from "axios";
import { get } from "svelte/store";
import { userStore } from "../stores/userStore";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

> > > > > > > Stashed changes

---

## **Backend — Express.js**

<<<<<<< Updated upstream
Struktur backend memisahkan `controller`, `route`, dan `utility`, sehingga setiap fungsi memiliki tanggung jawab yang jelas.
Contoh endpoint utama: `/auth/register` dan `/auth/login`.
=======

```ts
import { writable } from "svelte/store";
import { api } from "$lib";
import type { User, AuthResponse } from "$lib";

export const userStore = writable<User | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function login(email: string, password: string) {
  loading.set(true);
  error.set(null);
  try {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    userStore.set(res.data.user);
  } catch (err: any) {
    error.set(err.response?.data?.message || "Login gagal");
  } finally {
    loading.set(false);
  }
}

export async function register(nama: string, email: string, password: string) {
  loading.set(true);
  error.set(null);
  try {
    const res = await api.post<AuthResponse>("/auth/register", {
      user_nama: nama,
      user_email: email,
      user_password: password,
    });
    localStorage.setItem("token", res.data.token);
    userStore.set(res.data.user);
  } catch (err: any) {
    error.set(err.response?.data?.message || "Register gagal");
  } finally {
    loading.set(false);
  }
}

export function logout() {
  localStorage.removeItem("token");
  userStore.set(null);
  window.location.href = "/";
}
```

> > > > > > > Stashed changes

---

## **Menjalankan Proyek**

<<<<<<< Updated upstream

### Frontend (SvelteKit)

=======

```svelte
<script lang="ts">
  import { login, error, loading } from '$lib/stores/userStore';
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';

  const handleLogin = async () => {
    await login(email, password);
    if (!$error) goto('/dashboard');
  };
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
  <h1 class="text-2xl font-bold mb-4">Login</h1>
  <input type="email" bind:value={email} placeholder="Email" class="border rounded p-2 w-64 mb-2" />
  <input type="password" bind:value={password} placeholder="Password" class="border rounded p-2 w-64 mb-4" />
  <button on:click={handleLogin} class="bg-blue-600 text-white px-4 py-2 rounded w-64" disabled={$loading}>
    { $loading ? 'Loading...' : 'Login' }
  </button>
  {#if $error}<p class="text-red-500 mt-2">{$error}</p>{/if}
  <a href="/register" class="text-sm text-gray-400 mt-2 hover:text-blue-400">Belum punya akun? Register</a>
</div>
```

---

## 🧱 **Backend — Express.js**

### 📂 **index.js**

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
});
```

---

### 📂 **routes/auth.js**

```js
import express from "express";
import { register, login } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

---

### 📂 **controllers/authController.js**

```js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../utils/db.js";

export const register = async (req, res) => {
  const { user_nama, user_email, user_password } = req.body;
  try {
    const hashed = await bcrypt.hash(user_password, 10);
    await db.query(
      "INSERT INTO users (user_nama, user_email, user_password) VALUES (?, ?, ?)",
      [user_nama, user_email, hashed]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE user_email = ?", [
      user_email,
    ]);
    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Register gagal", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_email = ?", [
      email,
    ]);
    const user = rows[0];
    if (!user)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.user_password);
    if (!valid) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Login gagal", error: err.message });
  }
};
```

---

### 📂 **utils/db.js**

```js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sdp_project",
});

export default db;
```

---

## 🧑‍💻 **Menjalankan Proyek**

### 🔹 Frontend (SvelteKit)

> > > > > > > Stashed changes

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

<<<<<<< Updated upstream

- Frontend → [http://localhost:5173](http://localhost:5173)
- # Backend → [http://localhost:5000/api](http://localhost:5000/api)
- 👉 [http://localhost:5173](http://localhost:5173) → Frontend
- 👉 [http://localhost:5000/api](http://localhost:5000/api) → Backend
  > > > > > > > Stashed changes

---


## **Catatan Teknis**

<<<<<<< Updated upstream

- File `+server.ts` tidak digunakan karena seluruh request diarahkan ke backend Express.
- # Jika sistem dikembangkan menjadi **SSR dengan proteksi route**, middleware dapat diletakkan di `hooks.server.ts`.
- File `+server.ts` **tidak digunakan**, karena seluruh request diarahkan ke backend Express.
- Jika proyek ini berkembang ke sistem **SSR dengan proteksi route**, maka middleware dapat dibuat di `hooks.server.ts`.
  > > > > > > > Stashed changes

---

## **Lisensi**

MIT License — Bebas digunakan untuk keperluan akademik maupun pengembangan pribadi.

---

<<<<<<< Updated upstream

## **Penutup**

=======

> 📘 Dokumentasi ini ditulis untuk memudahkan developer memahami arsitektur **SvelteKit + Express + JWT Auth** secara menyeluruh.

```

>>>>>>> Stashed changes

Dokumentasi ini dibuat untuk membantu developer memahami arsitektur dan alur kerja sistem **SvelteKit + Express + JWT Authentication** secara menyeluruh, mulai dari frontend, backend, hingga integrasi token.

<<<<<<< Updated upstream
---
=======
```

> > > > > > > Stashed changes
