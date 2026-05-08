const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR3IDvcN33XjuoZL-Rnd9bGwXLReXJtn8KB3EZChXW8pnJbMsl065gnpW_fP6uZosluQ/exec"; // Masukkan URL Deploy kamu

// Ambil Data Saat Pertama Load
document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        tableBody.innerHTML = '';
        loading.style.display = 'none';
        
        data.forEach(item => {
            const row = `<tr>
                <td>${item.kode_barang}</td>
                <td><strong>${item.nama_suku_cadang}</strong></td>
                <td><span class="${item.stok < 5 ? 'badge-low' : ''}">${item.stok}</span></td>
                <td>Rp ${Number(item.harga).toLocaleString('id-ID')}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (e) {
        loading.innerText = "Gagal memuat data!";
    }
}

async function tambahData() {
    const btn = document.getElementById('btnSimpan');
    const data = {
        kode: document.getElementById('inKode').value,
        nama: document.getElementById('inNama').value,
        stok: document.getElementById('inStok').value,
        harga: document.getElementById('inHarga').value
    };

    if (!data.nama || !data.stok) return alert("Isi Nama & Stok!");

    btn.innerText = "Sedang Menyimpan...";
    btn.disabled = true;

    try {
        // Mengirim data menggunakan POST
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Menghindari masalah CORS di browser tertentu
            body: JSON.stringify(data)
        });

        alert("Data Terkirim ke Spreadsheet!");
        // Reset Form
        document.querySelectorAll('input').forEach(i => i.value = '');
        loadData(); // Refresh tabel
    } catch (e) {
        alert("Terjadi kesalahan.");
    } finally {
        btn.innerText = "Simpan ke Spreadsheet";
        btn.disabled = false;
    }
}
