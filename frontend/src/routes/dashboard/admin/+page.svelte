<!--src/routes/dashboard/admin/+page.svelte -->
<!-- halaman home untuk user role admin -->
<script lang="ts">
	export let data;
	console.log('============================================');
	console.log('masuk dashboard admin, isi data user : \n' + JSON.stringify(data.user, null, 2));
</script>

<div class="space-y-8">
	<h1 class="text-2xl font-bold mb-4">HOME</h1>
  <h2 class="text-xl font-bold mb-4">Welcome, {data.user?.user_nama}!</h2>
	<h2 class="text-xl font-bold mb-4">Role, {data.user?.user_role}!</h2>

	<p class="text-gray-700">
		Ini halaman utama dashboard admin kamu. Pilih menu di sidebar untuk melanjutkan.
	</p>
</div>
