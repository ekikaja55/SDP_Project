<script lang="ts">
    import { page } from '$app/stores';
    import { onMount, tick } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { 
        customerDetailStore, 
        loadingReport, 
        getDetailCustomer 
    } from '$lib';

    // Icons
    import { 
        ArrowLeft, Mail, Calendar, Clock, 
        Wallet, ShoppingBag, CreditCard, TrendingUp,
        Package, User, ShieldCheck
    } from '@lucide/svelte';

    import Chart from 'chart.js/auto';

    $: id = $page.params.id;
    let isLoading = true;

    // Canvas Refs
    let spendCanvas: HTMLCanvasElement;
    let productCanvas: HTMLCanvasElement;
    let statusCanvas: HTMLCanvasElement;

    // Chart Instances
    let spendChart: Chart | null = null;
    let productChart: Chart | null = null;
    let statusChart: Chart | null = null;

    onMount(async () => {
        isLoading = true;
        await getDetailCustomer(id); // Pastikan function ini update ke customerDetailStore
        isLoading = false;
    });

    // Reactive: Init charts saat data tersedia
    $: if ($customerDetailStore && !isLoading) {
        initCharts();
    }

    async function initCharts() {
        await tick();
        const data = $customerDetailStore?.charts;
        if (!data) return;

        // 1. SPENDING TREND (Line Chart)
        if (spendChart) spendChart.destroy();
        if (spendCanvas) {
            const ctx = spendCanvas.getContext('2d');
            const gradient = ctx?.createLinearGradient(0, 0, 0, 300);
            gradient?.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient?.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

            spendChart = new Chart(spendCanvas, {
                type: 'line',
                data: {
                    labels: data.spendingTrend.map(d => d.label),
                    datasets: [{
                        label: 'Pengeluaran',
                        data: data.spendingTrend.map(d => Number(d.value)),
                        borderColor: '#10b981', // Emerald
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#10b981',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { display: true, color: '#f4f4f5' }, ticks: { callback: (val) => (Number(val)/1000) + 'k' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // 2. TOP PRODUCTS (Horizontal Bar)
        if (productChart) productChart.destroy();
        if (productCanvas) {
            productChart = new Chart(productCanvas, {
                type: 'bar',
                data: {
                    labels: data.topProducts.map(p => p.productName),
                    datasets: [{
                        label: 'Qty',
                        data: data.topProducts.map(p => p.qty),
                        backgroundColor: '#3f3f46', // Zinc 700
                        borderRadius: 4,
                        barThickness: 12
                    }]
                },
                options: {
                    indexAxis: 'y', // Horizontal
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { grid: { display: false } } }
                }
            });
        }

        // 3. STATUS DISTRIBUTION (Doughnut)
        if (statusChart) statusChart.destroy();
        if (statusCanvas) {
            statusChart = new Chart(statusCanvas, {
                type: 'doughnut',
                data: {
                    labels: data.orderStatusDistribution.map(s => s.status),
                    datasets: [{
                        data: data.orderStatusDistribution.map(s => s.count),
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    const formatRupiah = (val: string) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));

    const formatDate = (dateStr: string) => 
        new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('selesai')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s.includes('pengiriman')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (s.includes('batal')) return 'bg-rose-100 text-rose-700 border-rose-200';
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    };
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
</script>

<div class="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-800">
    
    {#if isLoading}
        <div class="animate-pulse space-y-6">
            <div class="h-8 w-32 rounded bg-zinc-200"></div>
            <div class="h-40 rounded-3xl bg-zinc-200"></div>
            <div class="grid grid-cols-3 gap-6">
                <div class="h-32 rounded-3xl bg-zinc-200"></div>
                <div class="h-32 rounded-3xl bg-zinc-200"></div>
                <div class="h-32 rounded-3xl bg-zinc-200"></div>
            </div>
        </div>
    {:else if $customerDetailStore}
        {@const user = $customerDetailStore.profile}
        {@const stats = $customerDetailStore.stats}
        {@const charts = $customerDetailStore.charts}
        {@const history = $customerDetailStore.transactionHistory}

        <div class="mb-8 space-y-6">
            <button 
                on:click={() => window.history.back()} 
                class="group flex items-center gap-2 text-xs font-bold text-zinc-400 transition hover:text-zinc-900"
            >
                <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                KEMBALI KE LIST CUSTOMER
            </button>

            <div class="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5">
                <div class="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div class="flex items-start gap-5">
                        <div class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white shadow-xl shadow-zinc-900/20">
                            {getInitials(user.nama)}
                        </div>
                        
                        <div class="space-y-1">
                            <div class="flex items-center gap-3">
                                <h1 class="text-3xl font-black tracking-tight text-zinc-900">{user.nama}</h1>
                                <span class={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide border 
                                    ${stats.customerTier === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                    {stats.customerTier} Member
                                </span>
                            </div>
                            
                            <div class="flex flex-wrap gap-4 text-sm text-zinc-500 mt-2">
                                <div class="flex items-center gap-1.5">
                                    <Mail class="h-4 w-4" /> {user.email}
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <ShieldCheck class="h-4 w-4" /> Role: {user.role}
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="h-4 w-4" /> Join: {formatDate(user.joinDate)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-1 text-right">
                        <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Last Active</span>
                        <div class="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Clock class="h-4 w-4" />
                            {user.lastActive ? new Date(user.lastActive).toLocaleString('id-ID') : '-'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-3xl bg-zinc-900 p-6 text-white shadow-xl shadow-zinc-900/20">
                <div class="mb-4 flex items-center gap-2 text-zinc-400">
                    <Wallet class="h-5 w-5" />
                    <span class="text-xs font-bold uppercase tracking-wider">Lifetime Value</span>
                </div>
                <div class="text-2xl font-black tabular-nums">{formatRupiah(stats.lifetimeValue)}</div>
                <div class="mt-2 text-xs text-zinc-400">Total uang yang dibelanjakan</div>
            </div>

            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
                <div class="mb-4 flex items-center gap-2 text-zinc-400">
                    <ShoppingBag class="h-5 w-5" />
                    <span class="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                </div>
                <div class="text-3xl font-black text-zinc-900 tabular-nums">{stats.totalOrders}</div>
                <div class="mt-2 text-xs text-zinc-400">Kali transaksi berhasil</div>
            </div>

            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
                <div class="mb-4 flex items-center gap-2 text-zinc-400">
                    <CreditCard class="h-5 w-5" />
                    <span class="text-xs font-bold uppercase tracking-wider">Avg. Order Value</span>
                </div>
                <div class="text-2xl font-black text-zinc-900 tabular-nums">{formatRupiah(stats.averageOrderValue)}</div>
                <div class="mt-2 text-xs text-zinc-400">Rata-rata per keranjang</div>
            </div>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 lg:col-span-2">
                <div class="mb-6 flex items-center justify-between">
                    <h3 class="font-bold text-zinc-800">Tren Pengeluaran</h3>
                    <TrendingUp class="h-4 w-4 text-emerald-500" />
                </div>
                <div class="relative h-64 w-full">
                    <canvas bind:this={spendCanvas}></canvas>
                </div>
            </div>

            <div class="grid gap-6">
                <div class="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-900/5">
                    <div class="relative h-20 w-20 flex-shrink-0">
                        <canvas bind:this={statusCanvas}></canvas>
                    </div>
                    <div>
                        <span class="block text-2xl font-black text-zinc-900">{stats.totalOrders}</span>
                        <span class="text-xs font-semibold text-zinc-500">Total Transaksi</span>
                    </div>
                </div>

                <div class="flex-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
                    <h3 class="mb-4 text-sm font-bold text-zinc-800">Produk Favorit</h3>
                    <div class="relative h-40 w-full">
                        <canvas bind:this={productCanvas}></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5">
            <div class="border-b border-zinc-100 bg-zinc-50/50 px-8 py-5">
                <h3 class="font-bold text-zinc-800">Riwayat Transaksi</h3>
            </div>
            
            {#if history.length > 0}
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-white text-xs font-bold uppercase tracking-wider text-zinc-400">
                            <tr>
                                <th class="px-8 py-4">ID Transaksi</th>
                                <th class="px-8 py-4">Tanggal</th>
                                <th class="px-8 py-4">Status</th>
                                <th class="px-8 py-4 text-center">Items</th>
                                <th class="px-8 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-50">
                            {#each history as item}
                                <tr class="group hover:bg-zinc-50/80 transition-colors">
                                    <td class="px-8 py-4 font-mono text-xs font-medium text-zinc-500">
                                        #{item.id.substring(0,8)}
                                    </td>
                                    <td class="px-8 py-4 font-medium text-zinc-700">
                                        {formatDate(item.date)}
                                        <span class="block text-[10px] text-zinc-400 font-normal">
                                            {new Date(item.date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4">
                                        <span class={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4 text-center">
                                        <span class="inline-flex items-center gap-1 text-zinc-600">
                                            <Package class="h-3 w-3" /> {item.itemsCount}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4 text-right font-bold text-zinc-900 tabular-nums">
                                        {formatRupiah(item.total)}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div class="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <ShoppingBag class="h-10 w-10 mb-2 opacity-50" />
                    <p>Belum ada riwayat transaksi.</p>
                </div>
            {/if}
        </div>

    {:else}
        <div class="flex h-[50vh] items-center justify-center text-zinc-500">
            <p>Customer tidak ditemukan.</p>
        </div>
    {/if}
</div>