<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { goto } from '$app/navigation';
    import {
        getLaporanPenjualan,
        loadingTrans,
        laporanPenjualanStore,
        type RawTransaction
    } from '$lib';
    import DetailTransModal from '$lib/components/DetailTransModal.svelte';
    
    import { 
        ArrowLeft, Filter, RotateCcw, Eye, 
        TrendingUp, ShoppingBag, DollarSign, Activity,
        Calendar, ChevronDown
    } from '@lucide/svelte';

    import Chart from 'chart.js/auto';

    let selectedMonth = new Date().getMonth() + 1;
    let selectedYear = new Date().getFullYear();
    let showModal = false;
    let selectedTrans: RawTransaction | null = null;

    let trendCanvas: HTMLCanvasElement;
    let productCanvas: HTMLCanvasElement;
    let statusCanvas: HTMLCanvasElement;

    let trendChart: Chart | null = null;
    let productChart: Chart | null = null;
    let statusChart: Chart | null = null;

    const months = [
        { val: 1, label: 'Januari' }, { val: 2, label: 'Februari' }, { val: 3, label: 'Maret' },
        { val: 4, label: 'April' }, { val: 5, label: 'Mei' }, { val: 6, label: 'Juni' },
        { val: 7, label: 'Juli' }, { val: 8, label: 'Agustus' }, { val: 9, label: 'September' },
        { val: 10, label: 'Oktober' }, { val: 11, label: 'November' }, { val: 12, label: 'Desember' }
    ];
    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#71717a'; // zinc-500
    Chart.defaults.borderColor = '#f4f4f5'; // zinc-100

    onMount(() => {
        handleFilter();
    });

    $: if ($laporanPenjualanStore && !$loadingTrans) {
        initCharts();
    }

    function handleFilter() {
        getLaporanPenjualan({
            bulan: selectedMonth.toString(),
            tahun: selectedYear.toString()
        });
    }

    function handleReset() {
        selectedMonth = new Date().getMonth() + 1;
        selectedYear = new Date().getFullYear();
        handleFilter();
    }

    async function initCharts() {
        await tick(); 
        const data = $laporanPenjualanStore;
        if (!data) return;

        // 1. TREND CHART (Line)
        if (trendChart) trendChart.destroy();
        if (trendCanvas) {
            const ctx = trendCanvas.getContext('2d');
            const gradient = ctx?.createLinearGradient(0, 0, 0, 300);
            gradient?.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Emerald soft
            gradient?.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

            trendChart = new Chart(trendCanvas, {
                type: 'line',
                data: {
                    labels: data.salesTrend.map(d => {
                        const date = new Date(d.date);
                        return `${date.getDate()} ${months[date.getMonth()].label.substring(0,3)}`;
                    }), 
                    datasets: [{
                        label: 'Pendapatan',
                        data: data.salesTrend.map(d => Number(d.revenue)),
                        borderColor: '#10b981', 
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#10b981',
                        pointBorderWidth: 2,
                        fill: true,
                        tension: 0.35, 
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#18181b',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            padding: 10,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: (ctx) => `Rp ${Number(ctx.parsed.y).toLocaleString('id-ID')}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: '#f4f4f5', tickLength: 0 },
                            ticks: { 
                                callback: (val) => (Number(val) / 1000) + 'k',
                                font: { size: 11 }
                            } 
                        },
                        x: { 
                            grid: { display: false },
                            ticks: { font: { size: 11 } }
                        }
                    }
                }
            });
        }

        // 2. PRODUCT CHART (Bar)
        if (productChart) productChart.destroy();
        if (productCanvas) {
            productChart = new Chart(productCanvas, {
                type: 'bar',
                data: {
                    labels: data.topSellingProducts.map(p => p.productName),
                    datasets: [{
                        label: 'Qty',
                        data: data.topSellingProducts.map(p => p.totalQuantity),
                        backgroundColor: '#27272a', // Zinc 800
                        borderRadius: 6,
                        barThickness: 16,
                        hoverBackgroundColor: '#10b981'
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { 
                            grid: { display: false },
                            ticks: { 
                                font: { weight: 'bold', size: 11 },
                                color: '#3f3f46'
                            } 
                        }
                    }
                }
            });
        }

        // 3. STATUS CHART (Doughnut)
        if (statusChart) statusChart.destroy();
        if (statusCanvas) {
            statusChart = new Chart(statusCanvas, {
                type: 'doughnut',
                data: {
                    labels: data.statusDistribution.map(s => s.status),
                    datasets: [{
                        data: data.statusDistribution.map(s => s.count),
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#a1a1aa'],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { 
                            position: 'bottom', 
                            labels: { usePointStyle: true, boxWidth: 6, padding: 20, font: { size: 11 } } 
                        }
                    }
                }
            });
        }
    }

    function openDetail(item: RawTransaction) {
        selectedTrans = item;
        showModal = true;
    }

    const formatRupiah = (val: string) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
</script>

<div class="space-y-8 pb-10 font-sans text-zinc-800">
    
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-1">
            <button
                on:click={() => goto('/dashboard/admin/transaction')} 
                class="group flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-zinc-900"
            >
                <ArrowLeft class="h-3 w-3 transition-transform group-hover:-translate-x-1" /> KEMBALI
            </button>
            <h2 class="text-3xl font-extrabold tracking-tight text-zinc-900">Financial Report</h2>
            <p class="text-sm text-zinc-500">Analisis performa penjualan dan metrik bisnis.</p>
        </div>

        <div class="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-zinc-900/5">
            <div class="relative group">
                <select bind:value={selectedMonth} class="appearance-none cursor-pointer rounded-xl bg-zinc-50 py-2.5 pl-4 pr-10 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10">
                    {#each months as m} <option value={m.val}>{m.label}</option> {/each}
                </select>
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>

            <div class="relative group">
                <select bind:value={selectedYear} class="appearance-none cursor-pointer rounded-xl bg-zinc-50 py-2.5 pl-4 pr-10 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10">
                    {#each years as y} <option value={y}>{y}</option> {/each}
                </select>
            </div>

            <div class="mx-1 h-6 w-px bg-zinc-200"></div>

            <button on:click={handleFilter} class="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/10 transition hover:bg-zinc-800 hover:-translate-y-0.5 active:scale-95">
                <Filter class="h-4 w-4" /> Filter
            </button>
            <button on:click={handleReset} title="Reset Filter" class="rounded-xl p-2.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900">
                <RotateCcw class="h-4 w-4" />
            </button>
        </div>
    </div>

    {#if $loadingTrans}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {#each Array(4) as _}
                <div class="h-36 rounded-3xl bg-zinc-200/50"></div>
            {/each}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse mt-6">
            <div class="lg:col-span-2 h-96 rounded-3xl bg-zinc-200/50"></div>
            <div class="h-96 rounded-3xl bg-zinc-200/50"></div>
        </div>
    {:else if $laporanPenjualanStore}
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-zinc-900/5 transition hover:-translate-y-1 hover:shadow-lg">
                <div class="mb-4 flex items-start justify-between">
                    <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                        <DollarSign class="h-6 w-6" />
                    </div>
                    {#if $laporanPenjualanStore.summary.revenueGrowth !== 0}
                        <span class={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${$laporanPenjualanStore.summary.revenueGrowth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {$laporanPenjualanStore.summary.revenueGrowth >= 0 ? '+' : ''}{$laporanPenjualanStore.summary.revenueGrowth.toFixed(1)}%
                        </span>
                    {/if}
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Pendapatan</p>
                    <h3 class="mt-1 text-2xl font-black text-zinc-900 tabular-nums">
                        {formatRupiah($laporanPenjualanStore.summary.totalRevenue).replace('Rp', '')}
                    </h3>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-zinc-900/5 transition hover:-translate-y-1 hover:shadow-lg">
                <div class="mb-4 flex items-start justify-between">
                    <div class="rounded-2xl bg-blue-50 p-3 text-blue-600">
                        <ShoppingBag class="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Transaksi</p>
                    <h3 class="mt-1 text-2xl font-black text-zinc-900 tabular-nums">
                        {$laporanPenjualanStore.summary.totalOrders}
                    </h3>
                </div>
            </div>

             <div class="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-zinc-900/5 transition hover:-translate-y-1 hover:shadow-lg">
                <div class="mb-4 flex items-start justify-between">
                    <div class="rounded-2xl bg-orange-50 p-3 text-orange-600">
                        <Activity class="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-zinc-400">Rata-rata Order</p>
                    <h3 class="mt-1 text-2xl font-black text-zinc-900 tabular-nums">
                        {#if $laporanPenjualanStore.summary.totalOrders > 0}
                            {formatRupiah((Number($laporanPenjualanStore.summary.totalRevenue) / $laporanPenjualanStore.summary.totalOrders).toString()).replace('Rp', '')}
                        {:else}
                            0
                        {/if}
                    </h3>
                </div>
            </div>
            
            <div class="flex flex-col justify-center rounded-3xl bg-zinc-900 p-6 text-white shadow-xl">
                 <p class="text-xs font-bold uppercase tracking-wider text-zinc-500">Status Pertumbuhan Periode Ini</p>
                 <div class="mt-2 flex items-baseline gap-2">
                     <span class="text-3xl font-black">
                        {$laporanPenjualanStore.summary.revenueGrowth >= 0 ? 'Positif' : 'Negatif'}
                     </span>
                 </div>
                 <p class="mt-1 text-xs text-zinc-400">Dibandingkan periode sebelumnya.</p>
             </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 lg:col-span-2">
                <div class="mb-6 flex items-center justify-between">
                    <h3 class="font-bold text-zinc-800">Analitik Pendapatan Harian</h3>
                    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <TrendingUp class="h-3 w-3" /> Live Data
                    </span>
                </div>
                <div class="relative h-72 w-full">
                    <canvas bind:this={trendCanvas}></canvas>
                </div>
            </div>

            <div class="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
                <h3 class="mb-2 font-bold text-zinc-800">Distribusi Status</h3>
                <div class="relative flex min-h-[250px] flex-1 items-center justify-center">
                    <canvas bind:this={statusCanvas}></canvas>
                    <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
                        <span class="text-3xl font-black text-zinc-900">{$laporanPenjualanStore.summary.totalOrders}</span>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
                <h3 class="mb-6 font-bold text-zinc-800">Top 5 Produk Terlaris</h3>
                <div class="relative h-64 w-full">
                    <canvas bind:this={productCanvas}></canvas>
                </div>
            </div>

            <div class="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5 lg:col-span-2">
                <div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 class="font-bold text-zinc-800">Riwayat Transaksi (Live)</h3>
                    </div>
                    
                </div>
                <div class="flex-1 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-white text-xs font-bold uppercase tracking-wider text-zinc-400">
                            <tr>
                                <th class="px-6 py-4">ID Transaksi</th>
                                <th class="px-6 py-4">Tanggal</th>
                                <th class="px-6 py-4 text-right">Total</th>
                                <th class="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-50">
                            {#each $laporanPenjualanStore.rawTransactions.slice(0, 5) as item}
                                <tr class="group hover:bg-zinc-50/80 transition-colors">
                                    <td class="px-6 py-4 font-mono text-xs font-medium text-zinc-500 group-hover:text-zinc-800">
                                        #{item.transaksi_id?.substring(0,8)}
                                    </td>
                                    <td class="px-6 py-4 font-medium text-zinc-700 tabular-nums">
                                        {new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                    </td>
                                    <td class="px-6 py-4 text-right font-bold text-zinc-900 tabular-nums">
                                        {formatRupiah(item.transaksi_grand_total)}
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <button 
                                            on:click={() => openDetail(item)} 
                                            class="inline-flex items-center justify-center rounded-lg bg-white border border-zinc-200 p-2 text-zinc-400 shadow-sm transition hover:border-zinc-300 hover:text-zinc-900 active:translate-y-0.5"
                                        >
                                            <Eye class="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    {:else if !$loadingTrans}
        <div class="flex flex-col items-center justify-center py-32 rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
            <div class="flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/5 mb-4">
                <Activity class="h-8 w-8 text-zinc-300" />
            </div>
            <h3 class="text-lg font-bold text-zinc-900">Tidak ada data</h3>
            <p class="text-zinc-500 text-sm max-w-xs text-center mt-1">Belum ada transaksi yang tercatat untuk periode {months[selectedMonth-1].label} {selectedYear}.</p>
            <button on:click={handleReset} class="mt-6 text-sm font-semibold text-emerald-600 hover:underline">
                Reset Filter
            </button>
        </div>
    {/if}
</div>

{#if showModal && selectedTrans}
    <DetailTransModal data={selectedTrans} onClose={() => (showModal = false)} />
{/if}