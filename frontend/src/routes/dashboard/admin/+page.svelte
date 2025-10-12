<!--src/routes/dashboard/admin/+page.svelte -->
<!-- halaman home untuk user role admin -->
<script lang="ts">
	import { userStore } from '$lib';
	import { get } from 'svelte/store';
	const user = get(userStore);
</script>

<h1 class="text-2xl font-bold mb-4">Welcome, {user?.user_nama}!</h1>
<h2 class="text-2xl font-bold mb-4">Role, {user?.user_role}!</h2>

<p class="text-gray-700">
	Ini halaman utama dashboard admin kamu. Pilih menu di sidebar untuk melanjutkan.
</p>
