// URL Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvB2QS-6KQ4uXY_xPONYdSBVm3W8XMxt8MPY_TbNmWEAlCyFnkTiLRGBHYyPKFhJz6mQ/exec"; 

let dataStok = [];

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    loading.innerText = 'Memuat data terbaru...';
    
    try {
        const response = await fetch(SCRIPT_URL);
        dataStok = await response.json();
        
        console.log("Data dari Google Sheets:", dataStok); // Cek di Console (F12)
        renderTable(dataStok);
    } catch (e) {
        loading.innerText = 'Gagal mengambil data. Pastikan Apps Script diset ke "Anyone".';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        // DISESUAIKAN DENGAN NAMA KOLOM DI SPREADSHEET ANDA
        // Google Apps Script mengubah spasi menjadi underscore secara otomatis
        const kode = item.kode || '-';
        const nama = item.nama_suku_cadang || '-';
        const stok = item.stok || 0;
        const harga = item.harga || 0;

        const row = `<tr>
            <td>${kode}</td>
            <td><strong>${nama}</strong></td>
            <td><span class="${stok < 5 ? 'stok-low' : ''}">${stok}</span></td>
            <td>Rp ${Number(harga).toLocaleString('id-ID')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function tambahData() {
    const btn = document.getElementById('btnSimpan');
    const payload = {
        kode: document.getElementById('inKode').value,
        nama: document.getElementById('inNama').value,
        stok: document.getElementById('inStok').value,
        harga: document.getElementById('inHarga').value
    };

    if (!payload.nama || !payload.stok) return alert("Nama dan Stok harus diisi!");

    btn.disabled = true;
    btn.innerText = "Menyimpan...";

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(payload)
        });

        alert("Data Berhasil Disimpan!");
        // Reset Form
        document.getElementById('inKode').value = '';
        document.getElementById('inNama').value = '';
        document.getElementById('inStok').value = '';
        document.getElementById('inHarga').value = '';
        
        loadData(); // Memuat ulang tabel
    } catch (e) {
        alert("Gagal menyimpan.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Simpan ke Spreadsheet";
    }
}

function filterData() {
    const query = document.getElementById('cariBarang').value.toLowerCase();
    const filtered = dataStok.filter(item => {
        const nama = (item.nama_suku_cadang || "").toLowerCase();
        const kode = (String(item.kode) || "").toLowerCase();
        return nama.includes(query) || kode.includes(query);
    });
    renderTable(filtered);
}
