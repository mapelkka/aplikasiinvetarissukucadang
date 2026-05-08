const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOj9wZIFQqDC2SkGW-aHgFqJ_ilK9oFZZg-Rc0Ddpha6z63IMU0h54SGR12z2oUK5sdw/exec"; 

let dataStok = [];

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
        dataStok = await response.json();
        
        // CEK DI SINI: Klik kanan di browser > Inspect > Console
        console.log("Data diterima dari Google:");
        console.table(dataStok); 

        renderTable(dataStok);
    } catch (e) {
        loading.innerText = 'Gagal terhubung ke Google Sheets.';
    } finally {
        loading.style.display = 'none';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        // Kita gunakan Object.values jika nama kolom masih meleset
        const rowData = Object.values(item); 
        
        const row = `<tr>
            <td>${item.kode || item.kode_barang || '-'}</td>
            <td><strong>${item.nama_suku_cadang || item.nama || '-'}</strong></td>
            <td><span class="${item.stok < 5 ? 'stok-low' : ''}">${item.stok || 0}</span></td>
            <td>Rp ${Number(item.harga || 0).toLocaleString('id-ID')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Fungsi tambahData tetap sama seperti sebelumnya
