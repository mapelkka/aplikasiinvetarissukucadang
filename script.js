const API_URL = "https://script.google.com/macros/s/AKfycbyMkIznYA82l6yeA-k4cZ_5DsZsKGinFd9RTFl3fsD9P0-kJBp9pbDGzRbwu8rrMPduqw/exec"; 
let dataLokal = []; // Simpan data di sini agar pencarian lebih cepat

// Fungsi ambil data (GET)
async function ambilData() {
    const response = await fetch(API_URL);
    dataLokal = await response.json();
    renderData(dataLokal);
}

// FUNGSI INPUT DATA (POST)
async function tambahData() {
    const btn = document.getElementById('btnSimpan');
    const payload = {
        kode: document.getElementById('inKode').value,
        nama: document.getElementById('inNama').value,
        stok: document.getElementById('inStok').value,
        harga: document.getElementById('inHarga').value
    };

    if(!payload.nama || !payload.stok) return alert("Nama dan Stok wajib diisi!");

    btn.innerText = "Mengirim...";
    btn.disabled = true;

    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        alert("Data berhasil tersimpan!");
        location.reload(); // Refresh halaman untuk lihat hasil
    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan data.");
        btn.innerText = "Simpan ke Spreadsheet";
        btn.disabled = false;
    }
}

// Fungsi render dan filter tetap sama seperti sebelumnya...
