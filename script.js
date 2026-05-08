const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXAf38rdqt11j9Z8z6Mom5z1Eo-KlDZW2Fs4NSlXIbzELDaLSf0Re4AIY3wldc1-RJvg/exec"; 

let dataStok = [];

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    loading.innerText = 'Menghubungkan ke Spreadsheet...';
    
    try {
        // Tambahkan timestamp agar tidak ambil cache lama
        const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
        dataStok = await response.json();
        
        console.log("Data Berhasil Dimuat:", dataStok);
        renderTable(dataStok);
    } catch (e) {
        console.error("Gagal Load:", e);
        loading.innerText = 'Gagal memuat data. Periksa koneksi internet.';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">Data di Spreadsheet masih kosong.</td></tr>';
        return;
    }
    
    data.forEach(item => {
        // SESUAIKAN DENGAN LOG DI KONSOL KAMU
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

        alert("Data Terkirim! Mohon tunggu sebentar...");
        
        // Reset Form
        document.getElementById('inKode').value = '';
        document.getElementById('inNama').value = '';
        document.getElementById('inStok').value = '';
        document.getElementById('inHarga').value = '';
        
        // Jeda 2 detik agar Google selesai tulis data, lalu muat ulang tabel
        setTimeout(loadData, 2000); 
        
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
