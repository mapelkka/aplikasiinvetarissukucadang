const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyncAkSBHqYouEZWk721wJAhNFhJbsB8FFFa3EepsH3EfvdFaRc7uyWs99uYQiD80p0Qw/exec"; 

let dataStok = [];

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
        dataStok = await response.json();
        
        console.log("Data diterima:", dataStok); // Cek apakah di sini muncul data 'Oli' dsb.
        renderTable(dataStok);
    } catch (e) {
        loading.innerText = 'Gagal memuat data.';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">Data kosong. Silakan tambah barang.</td></tr>';
        return;
    }
    
    data.forEach(item => {
        // Logika untuk mendeteksi kunci meskipun namanya sedikit berbeda
        const kode = item.kode || item.kode_barang || "-";
        const nama = item.nama_suku_cadang || item.nama || item.nama_barang || "-";
        const stok = parseInt(item.stok) || 0;
        const harga = parseFloat(item.harga) || 0;

        const row = `<tr>
            <td>${kode}</td>
            <td><strong>${nama}</strong></td>
            <td><span class="${stok < 5 ? 'stok-low' : ''}">${stok}</span></td>
            <td>Rp ${harga.toLocaleString('id-ID')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Fungsi tambahData tetap sama seperti sebelumnya
