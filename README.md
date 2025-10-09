---

````markdown
# 🧠 **SDP_Project — Fullstack Auth System (SvelteKit + Express + JWT)**

## 📚 **Deskripsi Umum**
Proyek ini merupakan implementasi sistem **login & register** berbasis **SvelteKit (frontend)** dan **Express.js (backend)** dengan **autentikasi JWT**.  
Tujuannya adalah memberikan contoh arsitektur terstruktur untuk pengembangan aplikasi fullstack modern.

---

## 🏗️ **Struktur Direktori**
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
````

---

## ⚙️ **Alur Sistem**

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

## 🔐 **Alur Autentikasi JWT**

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

## 🧩 **Frontend — SvelteKit**

### 📂 **src/lib/api/api.ts**

```ts
import axios from 'axios';
import { get } from 'svelte/store';
import { userStore } from '../stores/userStore';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

### 📂 **src/lib/stores/userStore.ts**

```ts
import { writable } from 'svelte/store';
import { api } from '$lib';
import type { User, AuthResponse } from '$lib';

export const userStore = writable<User | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function login(email: string, password: string) {
  loading.set(true);
  error.set(null);
  try {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    userStore.set(res.data.user);
  } catch (err: any) {
    error.set(err.response?.data?.message || 'Login gagal');
  } finally {
    loading.set(false);
  }
}

export async function register(nama: string, email: string, password: string) {
  loading.set(true);
  error.set(null);
  try {
    const res = await api.post<AuthResponse>('/auth/register', {
      user_nama: nama,
      user_email: email,
      user_password: password
    });
    localStorage.setItem('token', res.data.token);
    userStore.set(res.data.user);
  } catch (err: any) {
    error.set(err.response?.data?.message || 'Register gagal');
  } finally {
    loading.set(false);
  }
}

export function logout() {
  localStorage.removeItem('token');
  userStore.set(null);
  window.location.href = '/';
}
```

---

### 📂 **src/routes/login/+page.svelte**

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
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
});
```

---

### 📂 **routes/auth.js**

```js
import express from 'express';
import { register, login } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

---

### 📂 **controllers/authController.js**

```js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../utils/db.js';

export const register = async (req, res) => {
  const { user_nama, user_email, user_password } = req.body;
  try {
    const hashed = await bcrypt.hash(user_password, 10);
    await db.query('INSERT INTO users (user_nama, user_email, user_password) VALUES (?, ?, ?)', [
      user_nama,
      user_email,
      hashed
    ]);

    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [user_email]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.user_email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Register gagal', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.user_password);
    if (!valid) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ id: user.id, email: user.user_email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login gagal', error: err.message });
  }
};
```

---

### 📂 **utils/db.js**

```js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sdp_project'
});

export default db;
```

---

## 🧑‍💻 **Menjalankan Proyek**

### 🔹 Frontend (SvelteKit)

```bash
cd frontend
npm install
npm run dev
```

### 🔹 Backend (Express)

```bash
cd backend
npm install
npm run start
```

Lalu buka:

* 👉 [http://localhost:5173](http://localhost:5173) → Frontend
* 👉 [http://localhost:5000/api](http://localhost:5000/api) → Backend

---

## 👥 **Tim Pengembang**

| Nama                         | NRP       | Peran              | Kontribusi Utama                 |
| ---------------------------- | --------- | ------------------ | -------------------------------- |
| **Rizki Arkant Pratama**     | 223011701 | Frontend Developer | Implementasi SvelteKit UI & Auth |
| **Alender Rico Wong**        | 223011699 | Frontend Developer | UI Page Login & Register         |
| **Fabian Kurniawan Limanto** | 223011701 | Backend Developer  | API Auth Express & JWT           |

---

## ⚠️ **Catatan**

* File `+server.ts` **tidak digunakan**, karena seluruh request diarahkan ke backend Express.
* Jika proyek ini berkembang ke sistem **SSR dengan proteksi route**, maka middleware dapat dibuat di `hooks.server.ts`.

---

## 🧾 **Lisensi**

MIT License — Bebas digunakan untuk keperluan akademik dan pengembangan pribadi.

---

> 📘 Dokumentasi ini ditulis untuk memudahkan developer memahami arsitektur **SvelteKit + Express + JWT Auth** secara menyeluruh.

````



