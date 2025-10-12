<!--src/routes/dashboard/user/+page.svelte -->
<!-- halaman home untuk user role  -->
<script lang="ts">
	import { userStore } from '$lib';
	import { get } from 'svelte/store';
	const user = get(userStore);
</script> 

<h1 class="mb-4 text-2xl font-bold">Welcome, {user?.user_nama}!</h1>
<h2 class="mb-4 text-2xl font-bold">Role, {user?.user_role}!</h2>

<p class="text-gray-700">
	Ini halaman utama dashboard user kamu. Pilih menu di sidebar untuk melanjutkan.
</p>
