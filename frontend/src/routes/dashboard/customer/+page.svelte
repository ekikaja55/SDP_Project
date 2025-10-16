<!--src/routes/dashboard/user/+page.svelte -->
<!-- halaman home untuk user role  -->
<script lang="ts">
	export let data;
	console.log('============================================');
	console.log('masuk dashboard admin, isi data user : \n' + JSON.stringify(data.user, null, 2));
</script>

<h1 class="mb-4 text-2xl font-bold">Welcome, {data.user.user_nama}!</h1>
<h2 class="mb-4 text-2xl font-bold">Role, {data.user.user_role}!</h2>

<p class="text-gray-700">
	Ini halaman utama dashboard user kamu. Pilih menu di sidebar untuk melanjutkan.
</p>
