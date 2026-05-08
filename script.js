// GANTI URL INI dengan URL Web App yang kamu salin tadi!
const API_URL = "https://script.google.com/macros/s/AKfycbw8roRFfjQNoPpLtGFa4-tofryy-TDW_g8CnkbYOcErFGnrLUSncA1FEF6kY1jrnSJrTA/exec";

const tableBody = document.getElementById('tableBody');
const loading = document.getElementById('loading');

async function ambilDataDariSheet() {
    try {
        const response = await fetch(API_URL);
        const dataSukuCadang = await response.json();
        renderData(dataSukuCadang);
    } catch (error) {
        console.error("Gagal memuat data:", error);
        loading.innerText = "Gagal memuat data. Pastikan URL API benar.";
    }
}

function renderData(items) {
    tableBody.innerHTML = "";
    loading.style.display = "none";
    
    items.forEach(item => {
        // Nama properti (item.stok, dll) harus sama dengan header di Sheet (setelah jadi lowercase)
        const row = `<tr>
            <td>${item.kode_barang || '-'}</td>
            <td><strong>${item.nama_suku_cadang || '-'}</strong></td>
            <td style="color: ${item.stok < 5 ? 'red' : 'black'}">${item.stok}</td>
            <td>${item.harga}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Fungsi Pencarian (Tetap sama)
function filterData() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    // Logika filter bisa ditambahkan di sini dengan memanggil ulang render dari variabel global
}

window.onload = ambilDataDariSheet;
