const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxITkMHo83A56mVzQRM2u4pNGA4Fg51xZQQ9rBB8rAdtPlYZ1119fzbGR1cR6m46IorZw/exec"; // Ganti dengan URL /exec Anda

document.addEventListener('DOMContentLoaded', loadData);

let dataStok = [];

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    loading.innerText = 'Memuat data terbaru...';
    
    try {
        const response = await fetch(SCRIPT_URL);
        dataStok = await response.json();
        renderTable(dataStok);
    } catch (e) {
        loading.innerText = 'Gagal mengambil data dari Google Sheets.';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = `<tr>
            <td>${item.kode_barang || '-'}</td>
            <td><strong>${item.nama_suku_cadang || '-'}</strong></td>
            <td><span class="${item.stok < 5 ? 'stok-low' : ''}">${item.stok}</span></td>
            <td>Rp ${Number(item.harga).toLocaleString('id-ID')}</td>
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

        alert("Berhasil disimpan!");
        // Reset form tanpa reload halaman
        document.getElementById('inKode').value = '';
        document.getElementById('inNama').value = '';
        document.getElementById('inStok').value = '';
        document.getElementById('inHarga').value = '';
        
        // Refresh tabel saja
        loadData(); 
    } catch (e) {
        alert("Gagal menyimpan.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Simpan ke Spreadsheet";
    }
}

function filterData() {
    const query = document.getElementById('cariBarang').value.toLowerCase();
    const filtered = dataStok.filter(item => 
        item.nama_suku_cadang.toLowerCase().includes(query) || 
        item.kode_barang.toLowerCase().includes(query)
    );
    renderTable(filtered);
}
