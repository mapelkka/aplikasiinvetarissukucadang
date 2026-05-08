// URL Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZ0WxLKbHBMOlU3vJreeN7rtmlPaqJupC6NBkHnXc_2aQTVt7m7KirBCMsBCVExuezZQ/exec"; 

// Variabel global untuk menyimpan data agar fitur pencarian lancar
let dataStok = [];

// Jalankan fungsi loadData saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadData);

/**
 * FUNGSI 1: MENGAMBIL DATA DARI GOOGLE SHEETS
 */
async function loadData() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    
    // Tampilkan pesan loading
    loading.style.display = 'block';
    loading.innerText = 'Memuat data terbaru...';
    tableBody.innerHTML = ''; // Kosongkan tabel saat memuat
    
    try {
        const response = await fetch(SCRIPT_URL);
        
        // Cek jika response sukses
        if (!response.ok) throw new Error("Gagal menghubungi server");

        dataStok = await response.json();
        
        // Jika data stok adalah objek error dari Apps Script
        if (dataStok.error) {
            loading.innerText = "Error: " + dataStok.error;
            return;
        }

        renderTable(dataStok);
        loading.style.display = 'none';
        
    } catch (e) {
        console.error(e);
        loading.innerText = 'Gagal mengambil data. Pastikan Apps Script sudah di-deploy sebagai "Anyone".';
    }
}

/**
 * FUNGSI 2: MENAMPILKAN DATA KE DALAM TABEL HTML
 */
function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Data kosong</td></tr>';
        return;
    }
    
    data.forEach(item => {
        // Logika warna stok rendah (misal di bawah 5)
        const stokClass = item.stok < 5 ? 'stok-low' : '';
        
        // Format harga ke Rupiah
        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(item.harga || 0);

        const row = `<tr>
            <td>${item.kode_barang || '-'}</td>
            <td><strong>${item.nama_suku_cadang || '-'}</strong></td>
            <td><span class="${stokClass}">${item.stok || 0}</span></td>
            <td>${hargaFormatted}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

/**
 * FUNGSI 3: MENGIRIM DATA BARU KE GOOGLE SHEETS
 */
async function tambahData() {
    const btn = document.getElementById('btnSimpan');
    
    // Ambil nilai dari input form
    const payload = {
        kode: document.getElementById('inKode').value.trim(),
        nama: document.getElementById('inNama').value.trim(),
        stok: document.getElementById('inStok').value,
        harga: document.getElementById('inHarga').value
    };

    // Validasi sederhana
    if (!payload.nama || !payload.stok) {
        alert("Nama Suku Cadang dan Jumlah Stok wajib diisi!");
        return;
    }

    // Ubah status tombol
    btn.disabled = true;
    btn.innerText = "Sedang Menyimpan...";

    try {
        // Mengirim data menggunakan metode POST
        // mode: 'no-cors' digunakan untuk menghindari blokir browser saat pengiriman
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(payload)
        });

        alert("Data berhasil tersimpan di Spreadsheet!");
        
        // Reset (kosongkan) form
        document.getElementById('inKode').value = '';
        document.getElementById('inNama').value = '';
        document.getElementById('inStok').value = '';
        document.getElementById('inHarga').value = '';
        
        // Refresh tabel untuk melihat data terbaru
        loadData(); 
        
    } catch (e) {
        console.error(e);
        alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
        // Kembalikan tombol ke kondisi semula
        btn.disabled = false;
        btn.innerText = "Simpan ke Spreadsheet";
    }
}

/**
 * FUNGSI 4: FITUR PENCARIAN (FILTER)
 */
function filterData() {
    const query = document.getElementById('cariBarang').value.toLowerCase();
    
    // Filter data berdasarkan Nama atau Kode
    const filtered = dataStok.filter(item => {
        const nama = (item.nama_suku_cadang || "").toLowerCase();
        const kode = (item.kode_barang || "").toLowerCase();
        return nama.includes(query) || kode.includes(query);
    });
    
    renderTable(filtered);
}
