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
        // Tambahkan timestamp agar browser tidak mengambil data lama (cache)
        const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
        dataStok = await response.json();
        
        console.log("Data dari Google Sheets:", dataStok);
        renderTable(dataStok);
    } catch (e) {
        console.error("Error loadData:", e);
        loading.innerText = 'Gagal mengambil data. Periksa koneksi atau URL Script.';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Data kosong atau belum sinkron</td></tr>';
        return;
    }
    
    data.forEach(item => {
        // Pastikan nama properti ini (item.nama_suku_cadang) sama dengan header di sheet (huruf kecil & spasi jadi _)
        const kode = item.kode || '-';
        const nama = item.nama_suku_cadang || '-';
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
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload)
        });

        // Karena 'no-cors', kita tidak bisa cek response.ok
        alert("Permintaan simpan terkirim!");
        
        // Reset Form
        document.getElementById('inKode').value = '';
        document.getElementById('inNama').value = '';
        document.getElementById('inStok').value = '';
        document.getElementById('inHarga').value = '';
        
        // Beri jeda 1.5 detik sebelum reload data agar Google Sheets selesai memproses
        setTimeout(loadData, 1500); 
        
    } catch (e) {
        console.error("Error tambahData:", e);
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
